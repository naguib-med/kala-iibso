import * as z from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

function generateAvatarUrl(email: string) {
  const seed = encodeURIComponent(email);
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundType=solid,gradientLinear&backgroundColor=b6e3f4,d1d4f9,ffd5dc,ffdfbf`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = registerSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await hash(password, 10);
    const avatarUrl = generateAvatarUrl(email);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        image: avatarUrl,
        name: email.split("@")[0],
      },
    });

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

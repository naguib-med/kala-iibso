export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }
  
  export interface PaymentMethod {
    id: string;
    last4: string;
    cardType: string | null;
    cardNumber: string;
    expiryDate: string;
    cardHolder: string;
    cvv: string;
    isDefault: boolean;
  }
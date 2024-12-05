export interface ProfileFormData {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: SelecetOption | object;
    target: SelecetOption | object;
}

export interface SelecetOption {
    id: string;
    label: string;
}

export interface SignupFormData {
    id: string;
    password: string;
    nickname: string;
}

export interface loginFormData {
    id: string;
    password: string;
}

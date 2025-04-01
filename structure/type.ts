export interface ProfileFormData {
    age: number;
    gender: number;
    height: number;
    weight: number;
    activityLevel: SelectOption | object;
    target: SelectOption | object;
}

export interface SelectOption {
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

export interface APIResponse<T> {
    success: boolean;
    data: T;

    message?: string;
    error?: string;
}

export interface UserInfo {
    id: number;
    nickname: string;
}

export interface UserProfile {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
    target: string;
}

export interface MypageProfile {
    age: number;
    gender: number;
    height: number;
    weight: number;
    activityLevel: string;
    target: string;
    created_at: Date;
}

export interface MypageHistory {
    question: string;
    content: string;
    created_at: Date;
}

export interface LoginData {
    accessToken: string;
    user: UserInfo;
    userProfile: UserProfile | null;
}

export enum KoreaTimeEnum {
    Day = "day",
}

export interface Meal {
    meal: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;

    checked: boolean;
}

export interface AIResponse {
    diet: Meal[];
    workout: string[];
}

export interface WeekdayStats {
    date: string;
    total: number;
    completed: number;
    rate: number;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  username: string;
}

export interface LoginResponseDto {
  success: boolean;
  user?: AuthUserDto;
  error?: string;
}

export interface MeResponseDto {
  user: AuthUserDto | null;
  error?: string;
}

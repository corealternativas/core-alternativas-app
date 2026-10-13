import React from "react"
import type { CategoryCode } from "../../domain/categories"

interface CategoryIconProps {
  code: CategoryCode
  size?: number
  strokeWidth?: number
  className?: string
}

const PATHS: Record<CategoryCode, React.ReactNode> = {
  // Casa
  A: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </>
  ),
  // Oficina — maletín
  B: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  // Deporte — mancuerna
  C: (
    <>
      <path d="M6.5 6.5v11" />
      <path d="M3 9v6" />
      <path d="M21 9v6" />
      <path d="M17.5 6.5v11" />
      <path d="M6.5 12h11" />
    </>
  ),
  // Salir — copa
  D: (
    <>
      <path d="M5 3h14l-2 8a5 5 0 0 1-10 0Z" />
      <path d="M12 16v5" />
      <path d="M8 21h8" />
    </>
  ),
  // Admin — bolsa de compras
  E: (
    <>
      <path d="M4 7h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </>
  ),
  // Dormir — luna
  F: (
    <>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </>
  ),
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  code,
  size = 20,
  strokeWidth = 1.75,
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[code]}
    </svg>
  )
}

export const EraserIcon: React.FC<{ size?: number; strokeWidth?: number }> = ({
  size = 20,
  strokeWidth = 1.75,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12 12 5l7 7-7 7H8Z" />
    <path d="m10.5 7.5 6 6" />
  </svg>
)

export const DownloadIcon: React.FC<{ size?: number; strokeWidth?: number }> = ({
  size = 18,
  strokeWidth = 2,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
)

export const EyeIcon: React.FC<{ size?: number; strokeWidth?: number }> = ({
  size = 18,
  strokeWidth = 1.75,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const EyeOffIcon: React.FC<{ size?: number; strokeWidth?: number }> = ({
  size = 18,
  strokeWidth = 1.75,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.9 4.24A10.5 10.5 0 0 1 12 4c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.1 4.1" />
    <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.3-.5 4.7-1.3" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M2 2l20 20" />
  </svg>
)

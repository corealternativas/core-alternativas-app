import React from "react"
import {
  StyledFooter,
  StyledFooterContent,
  StyledCopyright,
} from "./Footer.style"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <StyledFooter>
      <StyledFooterContent>
        <StyledCopyright>
          © {currentYear} CORE Clothes. All rights reserved.
        </StyledCopyright>
      </StyledFooterContent>
    </StyledFooter>
  )
}

import styled from "styled-components"
import { Link } from "react-router-dom"

export const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.6rem ${({ theme }) => theme.spacing.sm};
  }
`

export const StyledHeaderContent = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

export const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

export const StyledLogoWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;

  a {
    display: inline-flex;
  }
`

export const StyledLogo = styled.img`
  height: 100px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 44px;
  }
`

export const StyledTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  min-width: 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1rem;
    line-height: 1.2;
  }
`

export const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

export const StyledNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`

export const StyledUserInfo = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`

export const StyledLogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.4rem 0.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`

export const StyledLinkButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.4rem 0.4rem;

  &:hover {
    text-decoration: underline;
  }
`

export const StyledMenuButton = styled.button`
  display: none;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.35rem 0.5rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;

  &:hover, &[aria-expanded="true"] {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: inline-flex;
  }
`

export const StyledMobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  z-index: 200;
  animation: slideDown 0.14s ease-out;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`

export const StyledMobileMenuInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0;
  background-color: ${({ theme }) => theme.colors.white};
`

export const StyledMobileUserInfo = styled.div`
  padding: 0.7rem 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`

export const StyledMobileItem = styled.a`
  display: block;
  padding: 0.9rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.95rem;
  background-color: ${({ theme }) => theme.colors.white};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.surface};
    outline: none;
  }
`

export const StyledFlash = styled.div`
  position: absolute;
  bottom: -34px;
  right: 8%;
  background-color: #e6f4ea;
  color: #1e6f2b;
  padding: 0.4rem 0.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 90;
  animation: slideIn 0.15s ease-out;

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    right: 4%;
    left: 4%;
    text-align: center;
  }
`

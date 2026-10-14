import styled from "styled-components"
import { NavLink } from "react-router-dom"

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
  align-items: stretch;
  align-self: stretch;
  gap: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

export const StyledNavLink = styled(NavLink)`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: var(--surface-soft);
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  /* Accent bar glued to the header's bottom border. The nav + link stretch to
     fill the content-area height, and this bar extends past the header's
     vertical padding (theme.spacing.md) by 1px so it overlaps the border. */
  &.active::after {
    content: "";
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: calc(-1 * ${({ theme }) => theme.spacing.md} - 1px);
    height: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px 2px 0 0;
  }
`

export const StyledNavDivider = styled.span`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0 ${({ theme }) => theme.spacing.xs};
`

export const StyledProfile = styled.div`
  position: relative;
  display: inline-flex;
`

export const StyledProfileButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px 6px 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover,
  &[aria-expanded="true"] {
    background-color: var(--surface-soft);
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: var(--focus-ring);
  }
`

export const StyledProfileAvatar = styled.span`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
`

export const StyledProfileName = styled.span`
  font-size: 13px;
  font-weight: 500;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StyledProfileChevron = styled.svg<{ $open?: boolean }>`
  color: var(--text-muted);
  margin-left: 2px;
  flex-shrink: 0;
  transition: transform 0.15s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "none")};
`

export const StyledProfileMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 190px;
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
  z-index: 200;
  animation: profileMenuIn 0.14s ease-out;

  @keyframes profileMenuIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const StyledProfileItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: var(--surface-soft);
    outline: none;
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

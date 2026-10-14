import React, { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { ChangePasswordModal } from "../ChangePasswordModal/ChangePasswordModal"
import {
  StyledHeader,
  StyledHeaderContent,
  StyledLogoWrapper,
  StyledLogo,
  StyledNav,
  StyledNavLink,
  StyledNavDivider,
  StyledProfile,
  StyledProfileButton,
  StyledProfileAvatar,
  StyledProfileName,
  StyledProfileChevron,
  StyledProfileMenu,
  StyledProfileItem,
  StyledTitleWrapper,
  StyledFlash,
  StyledMenuButton,
  StyledMobileMenu,
  StyledMobileMenuInner,
  StyledMobileUserInfo,
  StyledMobileItem,
} from "./Header.style"

const MenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {open ? (
      <>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </>
    ) : (
      <>
        <path d="M3 6h18" />
        <path d="M3 12h18" />
        <path d="M3 18h18" />
      </>
    )}
  </svg>
)

interface ProfileMenuProps {
  name: string
  onChangePassword: () => void
  onLogout: () => void
}

// Desktop-only user menu: pill trigger + popover with account actions.
const ProfileMenu: React.FC<ProfileMenuProps> = ({ name, onChangePassword, onLogout }) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const pick = (action: () => void) => () => {
    setOpen(false)
    action()
  }

  const initial = (name.trim().charAt(0) || "?").toUpperCase()

  return (
    <StyledProfile ref={wrapperRef}>
      <StyledProfileButton
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <StyledProfileAvatar aria-hidden="true">{initial}</StyledProfileAvatar>
        <StyledProfileName>{name}</StyledProfileName>
        <StyledProfileChevron
          $open={open}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </StyledProfileChevron>
      </StyledProfileButton>
      {open && (
        <StyledProfileMenu role="menu">
          <StyledProfileItem type="button" role="menuitem" onClick={pick(onChangePassword)}>
            Cambiar contraseña
          </StyledProfileItem>
          <StyledProfileItem type="button" role="menuitem" onClick={pick(onLogout)}>
            Cerrar sesión
          </StyledProfileItem>
        </StyledProfileMenu>
      )}
    </StyledProfile>
  )
}

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [changePwOpen, setChangePwOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || buttonRef.current?.contains(t)) return
      setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onClick)
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate("/login", { replace: true })
  }

  const handlePasswordSuccess = () => {
    setFlash("Contraseña actualizada correctamente")
    window.setTimeout(() => setFlash(null), 3500)
  }

  const openChangePw = () => {
    setMenuOpen(false)
    setChangePwOpen(true)
  }

  const homeHref = user ? (user.role === "admin" ? "/admin/results" : "/calculadora") : "/login"

  return (
    <StyledHeader>
      <StyledHeaderContent>
        <StyledTitleWrapper>
          <StyledLogoWrapper>
            <Link to={homeHref}>
              <StyledLogo src="/coreLogo.webp" alt="CORE" />
            </Link>
          </StyledLogoWrapper>
        </StyledTitleWrapper>

        {user && (
          <>
            <StyledNav>
              {user.role === "admin" && (
                <>
                  <StyledNavLink to="/admin/results">Resultados de calculadora</StyledNavLink>
                  <StyledNavLink to="/admin/style-test">Resultados test de estilo</StyledNavLink>
                  <StyledNavLink to="/admin/users">Usuarios</StyledNavLink>
                </>
              )}
              <StyledNavDivider aria-hidden="true" />
              <ProfileMenu
                name={user.name || user.email}
                onChangePassword={() => setChangePwOpen(true)}
                onLogout={handleLogout}
              />
            </StyledNav>

            <StyledMenuButton
              ref={buttonRef}
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MenuIcon open={menuOpen} />
            </StyledMenuButton>
          </>
        )}
      </StyledHeaderContent>

      {user && menuOpen && (
        <StyledMobileMenu ref={menuRef} role="menu">
          <StyledMobileMenuInner>
            <StyledMobileUserInfo>{user.name || user.email}</StyledMobileUserInfo>
            {user.role === "admin" && (
              <>
                <StyledMobileItem as={Link} to="/admin/results" role="menuitem">
                  Resultados de calculadora
                </StyledMobileItem>
                <StyledMobileItem as={Link} to="/admin/style-test" role="menuitem">
                  Resultados test de estilo
                </StyledMobileItem>
                <StyledMobileItem as={Link} to="/admin/users" role="menuitem">
                  Usuarios
                </StyledMobileItem>
              </>
            )}
            <StyledMobileItem as="button" type="button" onClick={openChangePw} role="menuitem">
              Cambiar contraseña
            </StyledMobileItem>
            <StyledMobileItem as="button" type="button" onClick={handleLogout} role="menuitem">
              Cerrar sesión
            </StyledMobileItem>
          </StyledMobileMenuInner>
        </StyledMobileMenu>
      )}

      {flash && <StyledFlash>{flash}</StyledFlash>}
      <ChangePasswordModal
        open={changePwOpen}
        onClose={() => setChangePwOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </StyledHeader>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="fw-bold">404</h1>
      <p className="text-muted">Page not found</p>
      <Link to="/" className="btn btn-dark mt-2">Go home</Link>
    </div>
  )
}
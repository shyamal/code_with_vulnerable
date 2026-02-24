/**
 * SAMPLE: Vulnerable React Components
 *
 * Issues this file demonstrates (for VibeSafe scanning):
 *  1. XSS via dangerouslySetInnerHTML with unsanitized user input (CWE-79)
 *  2. Prototype pollution via Object.assign with unvalidated user input (CWE-1321)
 *  3. Prototype pollution via spread operator on user input (CWE-1321)
 */

import React, { useState } from 'react'

// ISSUE 1: XSS — dangerouslySetInnerHTML with raw user-supplied content
// An attacker can inject: <img src=x onerror="alert(document.cookie)">
export function CommentRenderer({ comment }: { comment: string }) {
  return (
    <div
      className="comment-body"
      dangerouslySetInnerHTML={{ __html: comment }}
    />
  )
}

// ISSUE 1 (again): Another dangerouslySetInnerHTML with dynamic content
export function BlogPost({ content, title }: { content: string; title: string }) {
  return (
    <article>
      <h1>{title}</h1>
      {/* This is unsafe — content comes from user/API without sanitization */}
      <section dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}

// ISSUE 2: Prototype pollution via Object.assign
// If userInput contains __proto__ key, it can pollute Object.prototype
export function mergeUserSettings(defaults: object, userInput: object) {
  // Unsafe: should validate userInput shape before merging
  return Object.assign({}, userInput)
}

// ISSUE 3: Prototype pollution via spread on unvalidated user input
export function buildQueryParams(userInput: Record<string, string>) {
  // Unsafe: spreading user-controlled object with no validation
  const params = {
    page: 1,
    limit: 20,
    ...userInput,   // an attacker could pass { __proto__: { isAdmin: true } }
  }
  return params
}

// Combined example: a form component with multiple issues
export function UserProfileEditor() {
  const [bio, setBio] = useState('')
  const [preview, setPreview] = useState('')

  function handlePreview() {
    // ISSUE 1: Storing raw HTML from user input, then rendering it unsanitized
    setPreview(bio)
  }

  return (
    <div>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Write your bio (HTML supported)"
      />
      <button onClick={handlePreview}>Preview</button>

      {/* ISSUE 1: XSS via dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: preview }} />
    </div>
  )
}

/**
 * Input Validation and Sanitization Utilities
 * Provides comprehensive validation and sanitization for user inputs
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input) return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(
  input: string,
  maxLength: number = 1000
): string {
  if (!input) return "";

  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate and sanitize email address
 */
export function validateEmail(email: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!email) {
    return { valid: false, sanitized: "", error: "Email is required" };
  }

  const sanitized = sanitizeString(email.toLowerCase(), 254);

  // RFC 5322 compliant email regex (simplified)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized, error: "Invalid email format" };
  }

  return { valid: true, sanitized };
}

/**
 * Validate GitHub URL
 */
export function validateGitHubUrl(url: string): {
  valid: boolean;
  owner?: string;
  repo?: string;
  error?: string;
} {
  if (!url) {
    return { valid: false, error: "URL is required" };
  }

  const sanitized = sanitizeString(url, 500);

  // GitHub URL regex
  const githubRegex =
    /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/;
  const match = sanitized.match(githubRegex);

  if (!match) {
    return { valid: false, error: "Invalid GitHub repository URL" };
  }

  const [, owner, repo] = match;

  // Validate owner and repo names
  if (owner.length > 39 || repo.length > 100) {
    return { valid: false, error: "Repository name too long" };
  }

  return { valid: true, owner, repo: repo.replace(/\.git$/, "") };
}

/**
 * Validate and sanitize project description
 */
export function validateDescription(
  description: string,
  minLength: number = 10,
  maxLength: number = 5000
): { valid: boolean; sanitized: string; error?: string } {
  if (!description) {
    return { valid: false, sanitized: "", error: "Description is required" };
  }

  const sanitized = sanitizeString(description, maxLength);

  if (sanitized.length < minLength) {
    return {
      valid: false,
      sanitized,
      error: `Description must be at least ${minLength} characters`,
    };
  }

  if (sanitized.length > maxLength) {
    return {
      valid: false,
      sanitized,
      error: `Description must not exceed ${maxLength} characters`,
    };
  }

  return { valid: true, sanitized };
}

/**
 * Validate comment content
 */
export function validateComment(content: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!content) {
    return { valid: false, sanitized: "", error: "Comment cannot be empty" };
  }

  const sanitized = sanitizeString(content, 2000);

  if (sanitized.length < 1) {
    return { valid: false, sanitized, error: "Comment cannot be empty" };
  }

  if (sanitized.length > 2000) {
    return {
      valid: false,
      sanitized,
      error: "Comment is too long (max 2000 characters)",
    };
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /(https?:\/\/[^\s]+){5,}/, // Too many URLs
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(sanitized)) {
      return { valid: false, sanitized, error: "Comment appears to be spam" };
    }
  }

  return { valid: true, sanitized };
}

/**
 * Validate numeric ID
 */
export function validateId(id: string | number): {
  valid: boolean;
  value: number;
  error?: string;
} {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numId) || numId < 1 || numId > Number.MAX_SAFE_INTEGER) {
    return { valid: false, value: 0, error: "Invalid ID" };
  }

  return { valid: true, value: numId };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: string | number,
  limit?: string | number
): { valid: boolean; page: number; limit: number; error?: string } {
  const pageNum = typeof page === "string" ? parseInt(page, 10) : page || 1;
  const limitNum =
    typeof limit === "string" ? parseInt(limit, 10) : limit || 20;

  if (isNaN(pageNum) || pageNum < 1) {
    return { valid: false, page: 1, limit: 20, error: "Invalid page number" };
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return {
      valid: false,
      page: pageNum,
      limit: 20,
      error: "Invalid limit (must be between 1 and 100)",
    };
  }

  return { valid: true, page: pageNum, limit: limitNum };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  if (!query) {
    return { valid: false, sanitized: "", error: "Search query is required" };
  }

  const sanitized = sanitizeString(query, 200);

  if (sanitized.length < 1) {
    return { valid: false, sanitized, error: "Search query cannot be empty" };
  }

  if (sanitized.length > 200) {
    return { valid: false, sanitized, error: "Search query is too long" };
  }

  return { valid: true, sanitized };
}

/**
 * Validate array of tags
 */
export function validateTags(tags: unknown): {
  valid: boolean;
  sanitized: string[];
  error?: string;
} {
  if (!Array.isArray(tags)) {
    return { valid: false, sanitized: [], error: "Tags must be an array" };
  }

  if (tags.length > 20) {
    return { valid: false, sanitized: [], error: "Too many tags (max 20)" };
  }

  const sanitized = tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => sanitizeString(tag, 50))
    .filter((tag) => tag.length > 0 && tag.length <= 50)
    .slice(0, 20);

  return { valid: true, sanitized };
}

/**
 * Validate rating value
 */
export function validateRating(rating: number): {
  valid: boolean;
  value: number;
  error?: string;
} {
  if (typeof rating !== "number" || isNaN(rating)) {
    return { valid: false, value: 0, error: "Rating must be a number" };
  }

  if (rating < 1 || rating > 5) {
    return { valid: false, value: 0, error: "Rating must be between 1 and 5" };
  }

  return { valid: true, value: Math.round(rating) };
}

/**
 * Validate JSON object size
 */
export function validateJsonSize(
  obj: unknown,
  maxSizeKb: number = 100
): { valid: boolean; error?: string } {
  try {
    const jsonString = JSON.stringify(obj);
    const sizeKb = new Blob([jsonString]).size / 1024;

    if (sizeKb > maxSizeKb) {
      return {
        valid: false,
        error: `Request payload too large (max ${maxSizeKb}KB)`,
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid JSON" };
  }
}

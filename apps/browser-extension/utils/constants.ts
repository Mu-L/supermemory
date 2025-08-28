/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
	SUPERMEMORY_API: import.meta.env.PROD
		? "https://api.supermemory.ai"
		: "http://localhost:8787",
	SUPERMEMORY_WEB: import.meta.env.PROD
		? "https://app.supermemory.ai"
		: "http://localhost:3000",
} as const

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
	BEARER_TOKEN: "bearer-token",
	TOKENS_LOGGED: "tokens-logged",
	TWITTER_COOKIE: "twitter-cookie",
	TWITTER_CSRF: "twitter-csrf",
	TWITTER_AUTH_TOKEN: "twitter-auth-token",
	DEFAULT_PROJECT: "sm-default-project",
} as const

/**
 * DOM Element IDs
 */
export const ELEMENT_IDS = {
	TWITTER_IMPORT_BUTTON: "sm-twitter-import-button",
	TWITTER_IMPORT_STATUS: "sm-twitter-import-status",
	TWITTER_CLOSE_BTN: "sm-twitter-close-btn",
	TWITTER_IMPORT_BTN: "sm-twitter-import-btn",
	TWITTER_SIGNIN_BTN: "sm-twitter-signin-btn",
	SUPERMEMORY_TOAST: "sm-toast",
	SUPERMEMORY_SAVE_BUTTON: "sm-save-button",
	SAVE_TWEET_ELEMENT: "sm-save-tweet-element",
	CHATGPT_INPUT_BAR_ELEMENT: "sm-chatgpt-input-bar-element",
} as const

/**
 * UI Configuration
 */
export const UI_CONFIG = {
	BUTTON_SHOW_DELAY: 2000, // milliseconds
	TOAST_DURATION: 3000, // milliseconds
	RATE_LIMIT_BASE_WAIT: 60000, // 1 minute
	PAGINATION_DELAY: 1000, // 1 second between requests
} as const

/**
 * Supported Domains
 */
export const DOMAINS = {
	TWITTER: ["x.com", "twitter.com"],
	CHATGPT: ["chatgpt.com", "chat.openai.com"],
	SUPERMEMORY: ["localhost", "supermemory.ai", "app.supermemory.ai"],
} as const

/**
 * Container Tags
 */
export const CONTAINER_TAGS = {
	TWITTER_BOOKMARKS: "sm_project_twitter_bookmarks",
	DEFAULT_PROJECT: "sm_project_default",
} as const

/**
 * Message Types for extension communication
 */
export const MESSAGE_TYPES = {
	SAVE_MEMORY: "sm-save-memory",
	SHOW_TOAST: "sm-show-toast",
	BATCH_IMPORT_ALL: "sm-batch-import-all",
	IMPORT_UPDATE: "sm-import-update",
	IMPORT_DONE: "sm-import-done",
	GET_RELATED_MEMORIES: "sm-get-related-memories",
} as const

export const CONTEXT_MENU_IDS = {
	SAVE_TO_SUPERMEMORY: "sm-save-to-supermemory",
} as const

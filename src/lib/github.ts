export interface GitHubTotals {
  totalStars: number;
  totalForks: number;
  repositories: GitHubRepo[];
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  owner?: {
    login: string;
  };
}

// Configuration
const GITHUB_USERNAME = "BishnuMukherjee123";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const MAX_PAGES = 10;
const PER_PAGE = 100;
const REQUEST_TIMEOUT = 20000; // 20 seconds
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Cache for rate limiting
let lastFetchTime = 0;
let consecutiveFailures = 0;
let cachedData: GitHubTotals | null = null;
const MIN_FETCH_INTERVAL = 30000; // 30 seconds minimum between requests

// Get GitHub token from environment
const GITHUB_TOKEN =
  (import.meta as unknown as { env: { VITE_GITHUB_TOKEN?: string } }).env
    ?.VITE_GITHUB_TOKEN || "";

// Rate limiting helper with exponential backoff
const rateLimitCheck = (): boolean => {
  const now = Date.now();
  const timeSinceLastFetch = now - lastFetchTime;

  // Calculate dynamic interval based on consecutive failures
  const dynamicInterval = MIN_FETCH_INTERVAL + consecutiveFailures * 10000; // Add 10s per failure

  if (timeSinceLastFetch < dynamicInterval) {
    const timeLeft = Math.ceil((dynamicInterval - timeSinceLastFetch) / 1000);
    console.warn(
      `Rate limiting: Please wait ${timeLeft} seconds before next request (failures: ${consecutiveFailures})`
    );
    return false;
  }

  lastFetchTime = now;
  return true;
};

// Track API call results
const trackApiCall = (success: boolean) => {
  if (success) {
    consecutiveFailures = 0; // Reset on success
  } else {
    consecutiveFailures++;
  }
};

// Error handling helper
const createError = (message: string, status?: number): Error => {
  const error = new Error(message);
  if (status) {
    (error as Error & { status?: number }).status = status;
  }
  return error;
};

// Fetch with retry logic
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = RETRY_ATTEMPTS
): Promise<Response> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      // Handle specific error cases
      if (response.status === 403) {
        throw createError("Rate limit exceeded", 403);
      }
      if (response.status === 404) {
        throw createError("User not found", 404);
      }
      if (response.status === 401) {
        throw createError("Unauthorized - check your GitHub token", 401);
      }

      throw createError(`API error: ${response.status}`, response.status);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      console.warn(
        `Fetch attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * attempt)
      );
    }
  }

  throw createError("Max retry attempts exceeded");
};

// Fetch repositories with pagination
export const fetchAllRepositories = async (): Promise<GitHubRepo[]> => {
  if (!rateLimitCheck()) {
    throw createError("Rate limit exceeded - please wait before trying again");
  }

  // Check if online
  if (!navigator.onLine) {
    throw createError("No internet connection");
  }

  // Prepare headers
  let usingToken = !!GITHUB_TOKEN;
  let headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (usingToken) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const allRepos: GitHubRepo[] = [];
  let page = 1;
  let hasMorePages = true;

  console.log(`🚀 Fetching repositories for ${GITHUB_USERNAME}...`);

  while (hasMorePages && page <= MAX_PAGES) {
    const url = `${GITHUB_API}?per_page=${PER_PAGE}&page=${page}&sort=updated&direction=desc&t=${Date.now()}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetchWithRetry(url, {
        method: "GET",
        headers,
        signal: controller.signal,
        cache: "no-store",
        mode: "cors",
        credentials: "omit",
      });

      clearTimeout(timeoutId);

      const repos: GitHubRepo[] = await response.json();

      if (repos.length === 0) {
        hasMorePages = false;
      } else {
        allRepos.push(...repos);
        console.log(`📄 Page ${page}: Found ${repos.length} repositories`);
        page++;
      }
    } catch (error) {
      // Handle 401 specifically by retrying without token
      if (usingToken && error instanceof Error && (error as any).status === 401) {
        console.warn("⚠️ GitHub token invalid or expired. Retrying without token...");
        usingToken = false;
        // Create new headers object without Authorization
        headers = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        };
        // Don't increment page, just continue loop to retry same page
        continue;
      }

      console.error(`❌ Error fetching page ${page}:`, error);
      throw error;
    }
  }

  console.log(`✅ Total repositories fetched: ${allRepos.length}`);
  return allRepos;
};

// Calculate totals from repositories
const calculateTotals = (repos: GitHubRepo[]): GitHubTotals => {
  if (!repos || repos.length === 0) {
    console.warn("No repositories found");
    return { totalStars: 0, totalForks: 0, repositories: [] };
  }

  // Verify we're getting the right user's data
  if (repos[0]?.owner?.login && repos[0].owner.login !== GITHUB_USERNAME) {
    console.warn(
      `⚠️ Expected user ${GITHUB_USERNAME}, but got ${repos[0].owner.login}`
    );
  }

  // Calculate totals using reduce for better performance
  const totals = repos.reduce(
    (acc, repo) => ({
      totalStars: acc.totalStars + (repo.stargazers_count || 0),
      totalForks: acc.totalForks + (repo.forks_count || 0),
    }),
    { totalStars: 0, totalForks: 0 }
  );

  // Log detailed information
  console.log(`📊 GitHub Stats:`, {
    totalRepos: repos.length,
    totalStars: totals.totalStars,
    totalForks: totals.totalForks,
    reposWithStars: repos.filter((repo) => repo.stargazers_count > 0).length,
  });

  // Log repositories with stars for debugging
  const reposWithStars = repos.filter((repo) => repo.stargazers_count > 0);
  if (reposWithStars.length > 0) {
    console.log(
      `⭐ Repositories with stars:`,
      reposWithStars.map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      }))
    );
  }

  return { ...totals, repositories: repos };
};

// Fallback fetch without custom headers
const fallbackFetch = async (): Promise<GitHubTotals> => {
  console.log("🔄 Trying fallback approach...");

  const url = `${GITHUB_API}?per_page=${PER_PAGE}&sort=updated&direction=desc&t=${Date.now()}`;

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
  });

  if (!response.ok) {
    throw createError(`Fallback failed: ${response.status}`, response.status);
  }

  const repos: GitHubRepo[] = await response.json();
  return calculateTotals(repos);
};

// Main function
export async function getGitHubTotals(): Promise<GitHubTotals> {
  try {
    const repos = await fetchAllRepositories();
    const totals = calculateTotals(repos);
    cachedData = totals; // Cache successful data
    trackApiCall(true); // Track successful call
    return totals;
  } catch (error) {
    trackApiCall(false); // Track failed call
    console.error("❌ GitHub API error:", error);

    // Return cached data if available and error is rate limiting
    if (
      cachedData &&
      error instanceof Error &&
      error.message.includes("Rate limit")
    ) {
      console.log("📦 Returning cached data due to rate limiting");
      return cachedData;
    }

    // Try fallback for network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.log("🌐 Network error detected, trying fallback...");
      try {
        return await fallbackFetch();
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        throw createError("Network error - please check your connection");
      }
    }

    // Re-throw known errors
    if (error instanceof Error) {
      throw error;
    }

    // Handle unknown errors
    throw createError("Unknown error occurred while fetching GitHub data");
  }
}

// Utility function to get user profile URL
export const getGitHubProfileUrl = (): string =>
  `https://github.com/${GITHUB_USERNAME}`;

// Utility function to check if token is configured
export const hasGitHubToken = (): boolean => !!GITHUB_TOKEN;

// Utility function to get rate limit info
export const getRateLimitInfo = (): {
  hasToken: boolean;
  minInterval: number;
} => ({
  hasToken: hasGitHubToken(),
  minInterval: MIN_FETCH_INTERVAL,
});

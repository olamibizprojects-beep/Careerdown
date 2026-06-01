"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  const user = session?.user as { name?: string; email?: string; image?: string; username?: string } | undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            className="mr-2 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <svg
              className="h-6 w-6 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <span className="hidden text-lg sm:inline">
              Career<span className="text-indigo-400">Down</span>
            </span>
          </Link>
        </div>

        {/* Center: Search */}
        <form method="GET" action="/explore" className="mx-4 hidden max-w-md flex-1 sm:flex">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <input
              type="search"
              name="q"
              placeholder="Search posts, topics, users..."
              className="block w-full rounded-full border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {status === 'authenticated' && (
            <Link
              href="/post/new"
              className="hidden rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 sm:inline-flex items-center gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Post
            </Link>
          )}

          {status === 'loading' ? (
            <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
          ) : status === 'authenticated' && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-700 px-2 py-1.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? ''} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600/40 text-xs font-bold text-indigo-300">
                    {(user.name ?? user.email ?? 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.username ? `@${user.username}` : user.name}
                </span>
                <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl">
                    <Link
                      href={`/u/${user.username ?? ''}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }) }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="border-t border-slate-800 px-4 py-2 sm:hidden">
        <form method="GET" action="/explore">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="search"
              name="q"
              placeholder="Search..."
              className="block w-full rounded-full border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>
    </header>
  );
}

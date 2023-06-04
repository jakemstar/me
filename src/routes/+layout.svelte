<script lang="ts">
  import { expoOut } from 'svelte/easing';
  import { fade, slide } from "svelte/transition";
  import "../app.css";
  import { page } from '$app/stores';

  const routes = [
    { name: 'Home', href: '/'},
    { name: 'Blog', href: '/blog'},
    { name: 'About', href: '/about'},
    { name: 'Links', href: '/links'},
  ]

  // mobile logic
  let mobileMenuVisible = false;
  let dropdownVisible = false;

  // stuff for the routes hover animation
  let routesHovered = false;
  let routeHoverDurationAnim = "duration-0"

  let routesRefs: HTMLAnchorElement[] = [];

  let routeHoverWidth = 0;
  let routeHoverPosition = 0;

  let routeHoverOpacity = 'opacity-0'

  function setRoutesNoHoverValues() {
    routesHovered = false;
    routeHoverOpacity='opacity-0';
    routeHoverDurationAnim='duration-0'
  }

  function setRoutesHoverValues(i: number) {
    routeHoverWidth = routesRefs[i].offsetWidth;
    routeHoverPosition = routesRefs[i].offsetLeft;
    routeHoverOpacity = 'opacity-100'
    if (routesHovered) routeHoverDurationAnim = "duration-150";
    routesHovered = true;
  }
</script>

<nav class="bg-slate-900 sticky z-[1]">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <!-- Mobile menu button-->
        <button on:click={() => mobileMenuVisible = !mobileMenuVisible} type="button" class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-600 hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={mobileMenuVisible}>
          <span class="sr-only">Open main menu</span>
          {#if !mobileMenuVisible}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          {/if}
          {#if mobileMenuVisible}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {/if}
        </button>
      </div>
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div class="flex flex-shrink-0 items-center">
          <img class="block h-8 w-auto lg:hidden" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
          <img class="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
        </div>
        <div class="hidden relative sm:ml-6 sm:block">
          <div style={`width:${routeHoverWidth}px; transform:translateX(${routeHoverPosition}px);`} class={`bg-slate-600 rounded-md h-9 z-[-1] absolute ${routeHoverDurationAnim} ${routeHoverOpacity}`}></div>
          <div on:mouseleave={() => setRoutesNoHoverValues()} class="flex space-x-4">
            {#each routes as route, i}
              <div on:mouseenter={() => setRoutesHoverValues(i)} class={"flex pb-1" + ($page.url.pathname === route.href ? "  border-b-2" : "")}>
                <a bind:this={routesRefs[i]} href={route.href} class={"text-slate-50 rounded-md px-3 py-2 text-sm font-medium"} aria-current="page">{route.name}</a>
              </div>
            {/each}
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button type="button" class="rounded-full bg-slate-800 p-1 text-slate-400 hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
          <span class="sr-only">View notifications</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>

        <!-- Profile dropdown -->
        <div class="relative ml-3">
          <div>
            <button on:click={() => dropdownVisible = !dropdownVisible} on:focusout={() => dropdownVisible = false} type="button" class="flex rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" src="/img/blankprofile.svg" alt="">
            </button>
          </div>

          <!-- Dropdown menu -->
          {#if dropdownVisible}
            <div transition:fade="{{duration: 400, easing: expoOut}}" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
              <!-- Active: "bg-slate-100", Not Active: "" -->
              <a href="/profile" class="block px-4 py-2 text-sm text-slate-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a>
              <a href="/settings" class="block px-4 py-2 text-sm text-slate-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
              <a href="/" class="block px-4 py-2 text-sm text-slate-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileMenuVisible}
    <div transition:slide="{{duration: 400, easing: expoOut}}" class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        {#each routes as route}
          <a href={route.href} class={"text-slate-50 block rounded-md px-3 py-2 text-base font-medium" + ($page.url.pathname === route.href ? " bg-slate-700" : " bg-slate-900")} aria-current="page">{route.name}</a>
        {/each}
      </div>
    </div>
  {/if}
</nav>
<div class="container mx-auto">
  <slot />
</div>

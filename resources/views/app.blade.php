@php
    $s = $blade_settings ?? [];
    $isAdmin = request()->is('admin*', 'dashboard', 'profile', 'login', 'forgot-password', 'reset-password*');
    $tracking = $s['tracking'] ?? [];
@endphp
<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $s['site_name'] ?? config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @if (! empty($s['site_favicon']))
            <link rel="icon" href="{{ $s['site_favicon'] }}">
        @endif

        {{-- Terapkan tema gelap sebelum render agar tidak berkedip --}}
        <script>
            try {
                const saved = localStorage.getItem('darkMode');
                const dark = saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (dark && ! location.pathname.startsWith('/cv')) document.documentElement.classList.add('dark');
            } catch (e) {}
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

        @unless ($isAdmin)
            @if (! empty($tracking['google_tag_manager']['enabled']))
                <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{{ $tracking['google_tag_manager']['id'] }}');</script>
            @endif
            @if (! empty($tracking['google_analytics']['enabled']))
                <script async src="https://www.googletagmanager.com/gtag/js?id={{ $tracking['google_analytics']['id'] }}"></script>
                <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{{ $tracking['google_analytics']['id'] }}');</script>
            @endif
            @if (! empty($tracking['facebook_pixel']['enabled']))
                <script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','{{ $tracking['facebook_pixel']['id'] }}');fbq('track','PageView');</script>
            @endif
            {!! $s['header_scripts'] ?? '' !!}
        @endunless

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @unless ($isAdmin)
            {!! $s['body_scripts'] ?? '' !!}
        @endunless

        @inertia

        @unless ($isAdmin)
            {!! $s['footer_scripts'] ?? '' !!}
        @endunless
    </body>
</html>

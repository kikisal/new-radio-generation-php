<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/core.php'; ?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Radio Generation - Home</title>
    
    <meta name="theme-color" content="#121212">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <link rel="shortcut icon" href="<?= SITE_URL ?>/assets/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/style.css?cache=<?= cv(); ?>" />
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/about-us.css?<?= cv(); ?>" />
    
    <script type="text/javascript">
        ((m) => {
            m.rg_config = {
                DEBUG_MODE:                     <?= DEBUG_MODE ? 'true' : 'false'; ?>,
                FEEDER_ENDPOINT:                '<?= SITE_URL ?>/api/feeds',
                FEEDER_CREATE_SESSION_ENDPOINT: '<?= SITE_URL ?>/api/fcs',
                VIEW_FEED_ENDPOINT:             '<?= SITE_URL ?>/api/get_feed',
                RETRY_FEED_TIMEOUT: 5000, // 5sec
                MAX_RETRYING_ATTEMPS: 10,

                RADIO_STREAMING_URL: '<?= $radioLink; ?>',
                RADIO_FETCH_LINK_API: '<?= RADIO_FETCH_LINK_API; ?>',
                RADIO_OPENFIRE_LINK: '<?= OPEN_FIREWALL_LINK; ?>',
            };
        })(window);
    </script>

    <script src="<?= SITE_URL ?>/assets/js/date-formatter.js?<?= cv(); ?>"></script>
    
    <!-- Core Components -->
    <script src="<?= SITE_URL ?>/assets/js/core.js?v=<?= cv(); ?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/audio-player.js?v=<?= cv(); ?>"></script>

    <!-- DOM Renderer -->
    <script src="<?= SITE_URL ?>/assets/js/dom-renderer.js?v=<?= cv(); ?>"></script>
    
    <!-- Feeder -->
    <script src="<?= SITE_URL ?>/assets/js/feeder.js?v=<?= cv(); ?>"></script>

    <!-- Static UX Handlers -->
    <script src="<?= SITE_URL; ?>/assets/js/radio-bar.js?v=<?= cv(); ?>"></script>
    <script src="<?= SITE_URL; ?>/assets/js/mobile-menu.js?v=<?= cv(); ?>"></script>

    <!-- Views Components -->
    <script src="<?= SITE_URL ?>/assets/js/views/components/row-stream-component.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/components/feed-cell.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/components/radio-player.js?v=<?=cv();?>"></script>

    <!-- Views -->
    <script src="<?= SITE_URL ?>/assets/js/views/feed-news-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/feed-podcast-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/feed-programs-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/about-us-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/view-post-view.js?v=<?=cv();?>"></script>
    
    <!-- RadioGen App -->
    <script src="<?= SITE_URL ?>/assets/js/radiogen-app.js?v=<?= cv(); ?>"></script>

    <!-- Standalone Image Slider -->
    <script defer src="<?= SITE_URL ?>/assets/js/image-slider.js?v=<?= cv(); ?>"></script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

    <link rel="preload" href="<?= SITE_URL; ?>/assets/icons/pause.svg" as="image" />
    <link rel="preload" href="<?= SITE_URL; ?>/assets/icons/play-button.svg" as="image" />
    <link rel="preload" href="<?= SITE_URL; ?>/assets/icons/radio-loading-spinning.svg" as="image" />
    <link rel="preload" href="<?= SITE_URL; ?>/assets/pause-button.svg" as="image" />
    
</head>
<body>
    <iframe --radio-ltmr-frame style="display: none" src="<?= OPEN_FIREWALL_SERVICE_LINK; ?>" frameborder="0"></iframe>
    
    <div class="mobile-menu-drawer-overlay">
        <div class="header-scrim"></div>
        <div class="mobile-menu-drawer">
            <div class="menu-header flex align-center">
                <div class="mobile-menu">
                    <div class="menu-button"></div>
                </div>
                <div class="live-image-wrapper live flex align-center">
                    <div class="live-image"></div>
                    <div class="live-circle"></div>
                </div>
            </div>
            <div class="header-sections-wrapper">
                <div class="header-sections">
                    <div class="menu-section">
                        <div class="menu-items">
                            <div class="menu-item flex align-center" route-page="/">
                                <div class="menu-icon home"></div>
                                <div class="menu-label">Home</div>
                            </div>
                            <div class="menu-item flex align-center" route-page="/podcast">
                                <div class="menu-icon podcast"></div>
                                <div class="menu-label">Podcast</div>    
                            </div>
                            <div class="menu-item flex align-center" route-page="/programs">
                                <div class="menu-icon programs"></div>
                                <div class="menu-label">Programmi</div>    
                            </div>
                            <div class="menu-item flex align-center" route-page="/about-us">
                                <div class="menu-icon contact"></div>
                                <div class="menu-label">Contatti</div>    
                            </div>
                        </div>
                        <div class="hor-bar"></div>
                    </div>
                    <div class="menu-section">
                        <div class="dflex row-dir align-center">
                            
                            <div class="s-icons dflex row-dir align-center" style="margin:0 auto">
                                <div class="icon" --key="facebook-icon">
                                    <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="7935ec95c421cee6d86eb22ecd11b7e3"><path style="display:inline" d="M283.122,122.174c0,5.24,0,22.319,0,46.583h83.424l-9.045,74.367h-74.379
                                        c0,114.688,0,268.375,0,268.375h-98.726c0,0,0-151.653,0-268.375h-51.443v-74.367h51.443c0-29.492,0-50.463,0-56.302
                                        c0-27.82-2.096-41.02,9.725-62.578C205.948,28.32,239.308-0.174,297.007,0.512c57.713,0.711,82.04,6.263,82.04,6.263
                                        l-12.501,79.257c0,0-36.853-9.731-54.942-6.263C293.539,83.238,283.122,94.366,283.122,122.174z"></path></g></svg>
                                </div>
                                
                                <div class="horizontal-sep-2"></div>
                                <div class="icon" --key="instagram-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#0F0F0F"/><path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#0F0F0F"/></svg>
                                </div>
                            </div>
                        </div>
                        <div class="hor-bar"></div>
                    </div>
                    
                    <div class="menu-section">
                        <div class="mh-wrapper">
                            <div class="small-text">
                                <span>&copy; 2024 www.radiogeneration.it</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <section class="header-section">
        <div class="dflex row-dir align-center justify-between header-wrapper">
            <div class="mobile-menu">
                <div class="menu-button"></div>
            </div>
            <div class="slogan header-item">
                <div class="flex align-center">
                    <div class="slogan-image"></div>
                    <div class="live-recording live"></div>
                </div>
            </div>
            <nav class="dflex row-dir nav-bar">
                <div class="item" header-tab="home">
                    <a>Home</a>
                    <div class="selection-bar"></div>
                </div>
                <div class="item" header-tab="podcasts">
                    <a>Podcast Radio</a>
                    <div class="selection-bar"></div>
                </div>
                <div class="item" header-tab="programs">
                    <a>Programmi</a>
                    <div class="selection-bar"></div>
                </div>
                <div class="item" header-tab="about-us">
                    <a>Contatti</a>
                    <div class="selection-bar"></div>
                </div>
            </nav>
            <div class="dflex row-dir align-center follow-us-wrapper header-item">
                <div class="sn-text">
                    <span class="follow-us-text">SEGUICI SU</span>
                </div>
                <div class="horizontal-sep"></div>
                <div class="s-icons dflex row-dir align-center">
                    <div class="icon" --key="facebook-icon">
                        <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="7935ec95c421cee6d86eb22ecd11b7e3"><path style="display:inline" d="M283.122,122.174c0,5.24,0,22.319,0,46.583h83.424l-9.045,74.367h-74.379
                            c0,114.688,0,268.375,0,268.375h-98.726c0,0,0-151.653,0-268.375h-51.443v-74.367h51.443c0-29.492,0-50.463,0-56.302
                            c0-27.82-2.096-41.02,9.725-62.578C205.948,28.32,239.308-0.174,297.007,0.512c57.713,0.711,82.04,6.263,82.04,6.263
                            l-12.501,79.257c0,0-36.853-9.731-54.942-6.263C293.539,83.238,283.122,94.366,283.122,122.174z"></path></g></svg>
                    </div>
                    
                    <div class="horizontal-sep-2"></div>
                    <div class="icon" --key="instagram-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#0F0F0F"/><path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#0F0F0F"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="image-slider">
        <div class="image-slider-container">
            <div class="image-slider-controller">
                <div class="image-slider-align" --slider-items>
                    <div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img1.jfif" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img2.jfif" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img3.jfif" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img4.jfif" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img5.jfif" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img6.jfif" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img7.jfif" alt=""/>
</div>

<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img8.jpg" alt=""/>
</div>

<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img10.jpg" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/img11.jpg" alt=""/>
</div>
<div class="image-slider-item">
	<img src="<?= SITE_URL ?>/assets/image-slider/3f60d47f-851e-4230-b61d-6d5dd035e529.jpeg" alt=""/>
</div>
                </div>
            </div>
        </div>
    </div>
    <div class="content-wrapper content-shadow">
        
        <div class="main-content">
            <div class="radio-space">
                <div class="playback"></div>
            </div>

            <div class="container-box">
                <section class="news-section">
                    <feeder-view></feeder-view>
                </section>
                <!--
                <section class="news-section">
                    <h1>Nuovi DJ Mixsets</h1>
                </section>
                -->
            </div>
        </div>
        <div class="flex-grow"></div>
        <div class="footer">
            <!--
            <div class="footer-big-section">
                <div class="footer-wrapper flex f-row space-between align-center">
                    <div class="footer-logo"><h2>Radio Generation</h2></div>
                    <div>
                        <div class="nav-item-list flex f-row space-even">
                            <div class="nav-item"><a href="/about-us">Chi siamo</a></div>
                            <div class="nav-item"><a href="/contacts">Contatti</></div>
                            <div class="nav-item"><a href="privacy-policy">Privacy Policy</a></div>                            
                        </div>
                    </div>
                    <div>A</div>    
                </div>
            </div>
            -->
            <!--<div class="brand-section">
                <span>&copy; www.radiogeneration.it, <span class="t-bold">tutti i diritti riservati</span></span>
            </div>
            -->
        </div>
    </div>
    <div class="radio-overlay" --radio-bar-overlay>
        <div class="radio-wrapper">
            <div class="flex align-center space-between">
                <div class="flex align-center">
                    <div class="radio-button" --play-button>
                        <div class="radio-play-circle">
                            <div class="play-button" --play-icon></div>
                        </div>
                    </div>
                    <div class="radio-text">
                        <div class="cta">
                            <span>Ascolta la diretta!</span>
                        </div>
                        <div class="slogan-mobile">
                            <span>La radio che si vede</span>
                        </div>
                    </div>
                    
                </div>    
                <div class="radio-slogan-text">
                    <span>La radio che si vede!</span>
                    <div class="slogan-small">
                        <span>Solo su www.radiogeneration.it</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <hidden-elements></hidden-elements>
    <script>
        (() => {

            const app = new RadioGenApp();
            try {
                app.route();
            } catch(ex) {
                // fallback in the worst case.
                document.body.querySelector('feeder-view').innerHTML = `<p style="padding-top:14px">Qualcosa è andato storto, <a style="cursor: pointer; text-decoration: underline" onclick="window.location.reload()">Ricarica</a></p>`;
            }

            setTimeout(() => {
                const e = document.querySelector('iframe[--radio-ltmr-frame]');
                e.remove();
            }, 3000);
        })();
    </script>
</body>
</html>
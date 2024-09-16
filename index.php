<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/core.php'; ?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Radio Generation - Home</title>
    <link rel="manifest" href="<?= SITE_URL ?>/manifest.json">
    <meta name="theme-color" content="#121212">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <link rel="shortcut icon" href="<?= SITE_URL ?>/assets/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/style.css?cache=<?= cv(); ?>" />
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/about-us.css" />
    
    <script type="text/javascript">
        ((m) => {
            m.rg_config = {
                DEBUG_MODE:                     <?= DEBUG_MODE ? 'true' : 'false'; ?>,
                FEEDER_ENDPOINT:                '<?= SITE_URL ?>/api/feeds',
                FEEDER_CREATE_SESSION_ENDPOINT: '<?= SITE_URL ?>/api/fcs',
                RETRY_FEED_TIMEOUT: 5000, // 5sec
                MAX_RETRYING_ATTEMPS: 10
            };
        })(window);
    </script>

    <script src="<?= SITE_URL ?>/assets/js/date-formatter.js?<?= cv(); ?>"></script>
    
    <script src="<?= SITE_URL ?>/assets/js/core.js?v=<?= cv(); ?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/dom-renderer.js?v=<?= cv(); ?>"></script>
    
    <script src="<?= SITE_URL ?>/assets/js/feeder.js?v=<?= cv(); ?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/feed-news-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/feed-podcast-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/feed-programs-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/about-us-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/views/view-post-view.js?v=<?=cv();?>"></script>
    <script src="<?= SITE_URL ?>/assets/js/radiogen-app.js?v=<?= cv(); ?>"></script>

    <script defer src="<?= SITE_URL ?>/assets/js/image-slider.js?v=<?= cv(); ?>"></script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
</head>
<body class="lock-scrollbar">
    <div class="mobile-menu-drawer-overlay">
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
                            <div class="menu-item active flex align-center" route-page="home">
                                <div class="menu-icon home"></div>
                                <div class="menu-label">Home</div>
                            </div>
                            <div class="menu-item flex align-center" route-page="podcast">
                                <div class="menu-icon podcast"></div>
                                <div class="menu-label">Podcast</div>    
                            </div>
                            <div class="menu-item flex align-center" route-page="programs">
                                <div class="menu-icon programs"></div>
                                <div class="menu-label">Programmi</div>    
                            </div>
                            <div class="menu-item flex align-center" route-page="about-us">
                                <div class="menu-icon contact"></div>
                                <div class="menu-label">Contatti</div>    
                            </div>
                        </div>
                        <div class="hor-bar"></div>
                    </div>
                    
                    <div class="menu-section">
                        <div class="mh-wrapper">
                            <div class="small-text">
                                <span>&copy; 2024 radiogeneration.com</span>
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
                    <div class="icon">
                        <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="7935ec95c421cee6d86eb22ecd11b7e3"><path style="display:inline" d="M283.122,122.174c0,5.24,0,22.319,0,46.583h83.424l-9.045,74.367h-74.379
                            c0,114.688,0,268.375,0,268.375h-98.726c0,0,0-151.653,0-268.375h-51.443v-74.367h51.443c0-29.492,0-50.463,0-56.302
                            c0-27.82-2.096-41.02,9.725-62.578C205.948,28.32,239.308-0.174,297.007,0.512c57.713,0.711,82.04,6.263,82.04,6.263
                            l-12.501,79.257c0,0-36.853-9.731-54.942-6.263C293.539,83.238,283.122,94.366,283.122,122.174z"></path></g></svg>
                    </div>
                    <div class="horizontal-sep-2"></div>
                    <div class="icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z" fill="#0F0F0F"/></svg>
                    </div>
                    <div class="horizontal-sep-2"></div>
                    <div class="icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#0F0F0F"/><path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#0F0F0F"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#0F0F0F"/></svg>
                    </div>
                    <div class="horizontal-sep-2"></div>
                    <div class="icon">
                        <svg viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>twitter [#154]</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-60.000000, -7521.000000)" fill="#000000"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M10.29,7377 C17.837,7377 21.965,7370.84365 21.965,7365.50546 C21.965,7365.33021 21.965,7365.15595 21.953,7364.98267 C22.756,7364.41163 23.449,7363.70276 24,7362.8915 C23.252,7363.21837 22.457,7363.433 21.644,7363.52751 C22.5,7363.02244 23.141,7362.2289 23.448,7361.2926 C22.642,7361.76321 21.761,7362.095 20.842,7362.27321 C19.288,7360.64674 16.689,7360.56798 15.036,7362.09796 C13.971,7363.08447 13.518,7364.55538 13.849,7365.95835 C10.55,7365.79492 7.476,7364.261 5.392,7361.73762 C4.303,7363.58363 4.86,7365.94457 6.663,7367.12996 C6.01,7367.11125 5.371,7366.93797 4.8,7366.62489 L4.8,7366.67608 C4.801,7368.5989 6.178,7370.2549 8.092,7370.63591 C7.488,7370.79836 6.854,7370.82199 6.24,7370.70483 C6.777,7372.35099 8.318,7373.47829 10.073,7373.51078 C8.62,7374.63513 6.825,7375.24554 4.977,7375.24358 C4.651,7375.24259 4.325,7375.22388 4,7375.18549 C5.877,7376.37088 8.06,7377 10.29,7376.99705" id="twitter-[#154]"></path></g></g></g></svg>
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
            <div class="brand-section">
                <span>&copy; radiogeneration.com, <span class="t-bold">tutti i diritti riservati</span></span>
            </div>
        </div>
    </div>
    <div class="radio-overlay">
        <div class="radio-wrapper">
            <div class="flex align-center space-between">
                <div class="flex align-center">
                    <div class="radio-button">
                        <div class="radio-play-circle">
                            <div class="play-button playing"></div>
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
                        <span>Solo su radiogeneration.com</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        (() => {

            const app = new RadioGenApp();
            try {
                app.route();
            } catch(ex) {
                // fallback in the worst case.
                document.body.querySelector('feeder-view').innerHTML = `<p style="padding-top:14px">Qualcosa è andato storto, <a style="cursor: pointer; text-decoration: underline" onclick="window.location.reload()">Ricarica</a></p>`;
            }
        })();
    </script>
</body>
</html>
//AOS
AOS.init({
    easing: "ease-out-back",
    duration: 1200,
    once: true
});

//loading
setTimeout(function () {
    $(".loading-box").addClass("smaller");
    $("body").removeClass("of-hidden");
    setTimeout(function () {
        $(".loading-box").remove();
        var app = document.getElementById("banner_text");
        var typewriter = new Typewriter(app, {
            loop: true
        });
        typewriter.typeString("Welcome to my portfolio")
                .pauseFor(2000)
                .deleteAll()
                .typeString("Web publisher, Jo JaeHun")
                .pauseFor(2000)
                .deleteAll()
                .typeString("Thank you for finding me")
                .pauseFor(2000)
                .deleteAll()
                .start();
    }, 800);
}, 2000);

//scroll - 새로고침 시 최상단 위치
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

//scroll
let isVisible = false;
$(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    const winHeight = $(this).height();
    $('header').toggleClass('down', scrollTop > 0);

    //menu - active 효과
    if (scrollTop < 400) {
        setActiveMenu('home');
    } else {
        $('.box-item').each(function () {
            const top = $(this).offset().top;
            const height = $(this).outerHeight();
            if (scrollTop >= top - 150 && scrollTop < top + height - 150) {
                setActiveMenu($(this).attr('id'));
                return false;
            }
        });
    }
    
    //fab - 보여주기 / 숨기기
    if (scrollTop > 200) {
        $('.fab_box').fadeIn(300);
    } else {
        $('.fab_box').fadeOut(300, function(){
        });
        $('.fab_box .more').removeClass('open');
        $('.fab_box .item').removeClass('show');
    }

    //skill - progress bar
    if (!isVisible && scrollTop + winHeight > $('.skill').offset().top + 100) {
        isVisible = true;
        $('.skill li').each(function () {
            const pVal = parseInt($(this).find('.item span').text());
            $(this).find('.progress p').animate({width: pVal + '%'}, 1500, 'swing');
        });
    }
});

//gnb - active
function setActiveMenu(id) {
    $('.gnb-d > li > a, .gnb-m > li > a').removeClass('active');
    $(`.gnb-d > li > a[href="#${id}"], .gnb-m > li > a[href="#${id}"]`).addClass('active');
}

//gnb - 클릭 시 해당 섹션으로 스크롤 이동
$(document).on('click', '.gnb-d > li > a, .gnb-m > li > a', function (e) {
    e.preventDefault();
    const $target = $($(this).attr('href'));
    if ($target.length) $('html, body').stop().animate({scrollTop: $target.offset().top - 20}, 550);
    $('.gnb-mWrap').hide(200);
});

//gnb - mobile 메뉴 열기
$(document).on('click', 'header .gnb-mBtn', function () {
    $('.gnb-mWrap').show(200);
    $('.fab_box .more').removeClass('open');
    $('.fab_box .item').removeClass('show');
});

//gnb - mobile 메뉴 닫기
$(document).on('click', '.gnb-mWrap', function () {
    $('.gnb-mWrap').hide(200);
});

//fab - 더보기 클릭
$('.fab_box .more').on('click', function () {
    $(this).toggleClass('open');
    if ($(this).hasClass('open')) {
      $('.fab_box .item').each(function (i) {
        const $el = $(this);
        setTimeout(() => $el.addClass('show'), i * 55);
      });
    } else {
      $('.fab_box .item').removeClass('show');
    }
  });

//fab - 최상단 이동
$('.fab_box .goTop').on('click', function () {
    $('html, body').animate({scrollTop: 0}, 400);
    $('.fab_box .more').removeClass('open');
    $('.fab_box .item').removeClass('show');
});

//about - 현재 나이 설정
let today = new Date();
let currentYear = today.getFullYear();
let birthYear = 1992;
let koreanAge = currentYear - birthYear;
$('.info .age').text(koreanAge);

//career - 총 경력 설정 (일은 계산 안하기 때문에 -3개월)
let careerTot = 0;
$('.career_list > li').each(function () {
    const careerTxt = $(this).find('strong').text().trim();
    const careerNum = careerTxt.match(/(\d{4})\.(\d{2})\s*-\s*(\d{4})\.(\d{2})/);
    if (careerNum) {
        const startYear = parseInt(careerNum[1]);
        const startMonth = parseInt(careerNum[2]);
        const endYear = parseInt(careerNum[3]);
        const endMonth = parseInt(careerNum[4]);
        careerTot += (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    }
});
careerTot -= 3;
const careerY = Math.floor(careerTot / 12);
const careerM = careerTot % 12;
$('.career_list').prev('h3').find('span').text(`${careerY}년 ${careerM}개월`);

//portfolio - lnb 선택
$(document).on('click', '.pf_box .lnb [role="tab"]', function (e) {
    e.preventDefault();
    const $items = $('.pf_box .group .item');
    const $list = $('.pf_box .list');
    const filter = $(this).text();
    $('[role="tab"]').attr('aria-selected', 'false');
    $(this).attr('aria-selected', 'true');
    $list.hide(250, function () {
        $items.hide();
        const $visible = filter === 'All' ? $items : $items.filter(`[data-category="${filter}"]`);
        $items.addClass('aos-animate');
        $list.show();
        $visible.show(250);
        pfCount();
        AOS.refresh();
    });
});

// portfolio - 보여주고 있는 프로젝트 갯수 설정
function pfCount() {$('.pf_box .lnb > h3 > span').text($('.pf_box .group .item:visible').length)};

//portfolio - lnb 키보드 제어
$(document).on('keydown', '.pf_box .lnb [role="tab"]', function (e) {
    const $tabs = $('.pf_box .lnb [role="tab"]');
    const index = $tabs.index(this);
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        $tabs.eq((index + 1) % $tabs.length).focus().trigger('click');
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        $tabs.eq((index - 1 + $tabs.length) % $tabs.length).focus().trigger('click');
    }
});

//portfolio - list 생성
function renderProjectList() {
    for (const id in projectData) {
        const data = projectData[id];
        let projectItem = `<li class="item" id="${id}" role="button" tabindex="0" 
                                data-category="${data.category}" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="${data.aosDelay}">
                                <div>
                                    <span><img src="${data.thum}" alt="${data.title}"></span>
                                    <h3>${data.name}</h3>
                                    <p>${data.info}</p>
                                </div>
                            </li>`;
        $('.pf_box .group').append(projectItem);
    }
    if (typeof AOS !== 'undefined') AOS.refresh();
    pfCount();
}
renderProjectList();

//portfolio - modal - 열기
$(document).on('click', '.pf_box .group .item', function () {
    $('.fab_box .more').removeClass('open');
    $('.fab_box .item').removeClass('show');
    const pId = $(this).attr("id");
    const data = projectData[pId];
    if (!data) return;

    //기존 swiper 제거
    if (window.pmSwiper) {
        window.pmSwiper.destroy(true, true);
        window.pmSwiper = null;
    }

    //modal content 생성
    let modalContent = `<div class="pm_content">
                            <article class="pm_tit">
                                <h3>${data.title}</h3>
                                <span class="close" title="닫기"></span>
                            </article>
                            <article class="pm_swiperBox">
                                <div class="swiper pm_swiper">
                                    <ul class="swiper-wrapper">
                                        ${data.screen.map(src => `<li class="swiper-slide"><img src="${src}" alt="${data.title}"></li>`).join('')}
                                    </ul>
                                </div>
                                <div class="swiper-pagination"></div>
                            </article>
                            <article class="pm_info">
                                <ul>
                                    <li class="item"><strong>개요</strong><p>${data.summary}</p></li>
                                    <li class="item">
                                        <strong>주소</strong>
                                        <p>
                                            ${data.url ? `<a href="${data.url}" class="goUrl" data-device="${data.device}">${data.url}</a>` : ''}
                                            <small>${data.status}</small>
                                        </p>
                                    </li>
                                    <li class="item four">
                                        <strong>소속</strong><p>${data.company}</p>
                                        <strong>기간</strong><p>${data.period}</p>
                                    </li>
                                    <li class="item four">
                                        <strong>참여</strong><p class="t-ul">${data.part}</p>
                                        <strong>범위</strong><p>${data.scope}</p>
                                    </li>
                                    <li class="item"><strong>기술</strong><p>${data.skill}</p></li>
                                    <li class="item">
                                        <strong>업무</strong>
                                        <div class="dot gray">${data.work.map(w => `<p>${w}</p>`).join('')}</div>
                                    </li>
                                    <li class="item">
                                        <strong>성과</strong>
                                        <div class="dot">${data.result.map(r => `<p>${r}</p>`).join('')}</div>
                                    </li>
                                </ul>
                            </article>
                        </div>`;
    $(".pm_box").html(modalContent);

    //swiper 설정
    window.pmSwiper = new Swiper(".pm_swiper", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
        },
    });

    $('.pm_wrap').fadeIn(250, 'easeOutQuad', function () {
        $('.pm_box').slideDown(300, 'easeOutQuad');
    });
    $('body').addClass('of-hidden');
});

//portfolio - 키보드 제어
$(document).on('keydown', '.pf_box .group .item', function(e) {
    if (e.key === 'Enter' || e.key === ' ') $(this).trigger('click');
});

//portfolio - modal - 닫기
$(document).on('click', '.pm_tit > .close', function () {
    //기존 swiper 제거
    if (window.pmSwiper) {
        window.pmSwiper.destroy(true, true);
        window.pmSwiper = null;
    }
    $('.pm_box').slideUp(250, 'easeOutQuad', function () {
        $('.pm_box').empty();
        $('.pm_wrap').fadeOut(300, 'easeOutQuad');
    });
    $('body').removeClass('of-hidden');
});

//portfolio - modal - 사이트 열기
$(document).on('click', '.goUrl', function (e) {
    e.preventDefault();
    const url = $(this).attr('href');
    const device = $(this).data('device');
    if (!url) return;
    if (device === 'mobile') {
        const dvWidth = 400;
        const dvHeight = 700;
        const dvLeft = (screen.dvWidth - dvWidth) / 2;
        const dvTop = (screen.dvHeight - dvHeight) / 2;
        window.open(url, '_blank', `width=${dvWidth},height=${dvHeight},left=${dvLeft},top=${dvTop},resizable=yes,scrollbars=yes`);
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
});
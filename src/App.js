import './App.css';

import Preloader from './components/Preloader/Preloader';
import MKDan from './images/mortal-kombat-3.png'
import { Header } from './components/Header/Header'
import { Content } from './components/Content/Content';
import { Footer } from './components/Footer/Footer';
import { useEffect, useRef, useState, useLayoutEffect, forwardRef, createRef, useReducer, useMemo } from 'react';
import { gsap, selector } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from 'smoothscroll-for-websites'
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import portfolio from './pdf-portfolio/portfolio.pdf'

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin)


function App() {
    let [sectionSelector, setCurrentSectionSelector] = useState(null)
    let [eggVisible, setEggVisible] = useState(false)
    let [blackTheme, setBlackTheme] = useState(JSON.parse(localStorage.getItem('themeIsBlack')) || false)
    let pageContainer = useRef()
    let panelGreeting = useRef()
    let panelAbout = useRef()
    let footer = useRef()
    const DanImg = useRef(null)

    useEffect(() => {
        localStorage.setItem('themeIsBlack', JSON.stringify(blackTheme));
    }, [blackTheme])

    useLayoutEffect(() => {
        let ctx = panelSlide(gsap, pageContainer, setCurrentSectionSelector, panelGreeting, panelAbout, footer)
        return () => ctx.revert();
    }, [])


    useEffect(() => {
        // let ctx = gsap.context(() => {

        setTimeout(() => {
            SmoothScroll({
                frameRate: 144,
                animationTime: 1000,
                stepSize: 100,
                pulseAlgorithm: 1,
                pulseScale: 4,
                pulseNormalize: 1,
                accelerationDelta: 50,
                accelerationMax: 3,
                keyboardSupport: 1,
                arrowScroll: 50,
                fixedBackground: 0,
                touchpadSupport: true,
            });
            // SmoothScroll({
            //     animationTime: 1200,
            //     stepSize: 75,
            //     accelerationDelta: 30,
            //     accelerationMax: 1,
            //     keyboardSupport: true,
            //     arrowScroll: 50,
            //     pulseAlgorithm: true,
            //     pulseScale: 4,
            //     pulseNormalize: 1,
            //     touchpadSupport: true,
            // })
        }, 2001)
        // }, pageContainer.current)
        // return () => ctx.revert();
    }, [])

    useLayoutEffect(() => {
        if (eggVisible) {
            console.log('da')
            const ctx = gsap.context(() => {
                const tl = gsap.timeline()
                tl.to(DanImg.current, {
                    yPercent: -200,
                    duration: .5
                })
                    .to(DanImg.current, {
                        delay: 1,
                        duration: .3,
                        yPercent: 200,
                        onComplete: () => setEggVisible(false)
                    })
                return tl
            }
            )
            return () => ctx.revert()
        }
    }, [eggVisible])
    return (
        <div className={blackTheme ? 'page__container page__container_black' : 'page__container'}
            ref={pageContainer}
        >
            <Header gsap={gsap}
                ScrollTrigger={ScrollTrigger}
                ScrollToPlugin={ScrollToPlugin}
                sectionSelector={sectionSelector}
                setCurrentSectionSelector={setCurrentSectionSelector}
                setBlackTheme={setBlackTheme}
                blackTheme={blackTheme}
            />
            <Content gsap={gsap}
                blackTheme={blackTheme}
                ScrollTrigger={ScrollTrigger}
                panelGreeting={panelGreeting}
                panelAbout={panelAbout}

            />
            <Footer portfolio={portfolio} forwardRef={footer} />
            <Preloader blackTheme={blackTheme} />
            <div className='easter_egg-container'>
                <button className='easter_egg-button' onClick={() => setEggVisible(true)}></button>
                <img className='easter_egg-dan' ref={DanImg} src={MKDan} alt='Дэн Форден'></img>
            </div>
        </div>
    );
}



function panelSlide(gsap, pageContainer, setCurrentSectionSelector, panelGreeting, panelAbout, footer) {
    let ctx = gsap.context(() => {
        gsap.to(panelGreeting.current, {
            y: -1,
            scrollTrigger: {
                trigger: panelGreeting.current,
                pin: true,
                start: "+=100% bottom",
                end: () => '+=' + '+=110%',
                pinSpacing: false,
                scrub: true,
                // anticipatePin: 1 / 10,
                pinType: 'fixed',
            }
        });
        gsap.to(panelAbout.current, {
            y: -1,
            scrollTrigger: {
                trigger: panelAbout.current,
                pin: true,
                start: "+=100% bottom+=1px",
                onEnter: e => {
                    setCurrentSectionSelector('about')
                },
                onEnterBack: (e) => {
                    setCurrentSectionSelector('about')
                },
                onLeave: (e) => {
                    setCurrentSectionSelector('works')
                },
                end: '+=100% top-=15%',
                pinSpacing: false,
                scrub: .1,
                anticipatePin: true,
                // markers: true,
                pinType: 'fixed',
            }
        })

        gsap.to(footer.current, {
            scrollTrigger: {
                trigger: footer.current,
                pin: false,
                pinSpacing: false,
                start: "center bottom",
                pinSpacing: false,
                scrub: false,
                // markers: true,
                onEnter: e => {
                    setCurrentSectionSelector('footer')
                },
                onLeaveBack: () => {
                    setCurrentSectionSelector('works')
                }
            }
        })
    }, pageContainer.current);
    return ctx
}







// ScrollTrigger.refresh()
export default App;

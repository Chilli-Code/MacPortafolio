import { ArrowDown, Mail } from "lucide-react";
import { useEffect, useRef } from "react";



const HeroSection = () =>{
    const shopButtonRef = useRef();
    const containerRef = useRef();

    useEffect (() =>{
        const btn = shopButtonRef.current;
        const container = containerRef.current;
        if(!btn || !container)return

        let rafId = null
        let targetX = 0
        let targetY = 0

        const maxOffset = 180

        const getRect = () => container.getBoundingClientRect();

        function onMouseMove (e) {
            const rect = getRect();

            const relX = e.clientX - (rect.left + rect.width/2)
            const relY = e.clientY - (rect.top + rect.height/2)

            const nx = relX / (rect.width/2)
            const ny = relY /  (rect.height/2)

            targetX = Math.max(-1, Math.min(1, nx)) * maxOffset;
            targetY = Math.max(-1, Math.min(1, ny)) * maxOffset;

            if(!rafId) rafId = requestAnimationFrame(animate);
        }

        function onMouseEnter (e){
            onMouseMove(e)
        }

        function onMouseLeave(){
            targetX = 0
            targetY = 0
            if(!rafId) rafId = requestAnimationFrame(animate)
        }

        function animate(){
            const style = btn.style
            const cur = btn.__pos || { x:0, y:0 }
            
            cur.x +=(targetX - cur.x) * 0.12
            cur.y +=(targetY - cur.y) * 0.12

            style.transform = `translate(${cur.x}px, ${cur.y}px)`
            btn.__pos = cur
            
            const diff = Math.abs(targetX - cur.x) + Math.abs(targetY - cur.y)

            if(diff > 0.3 ){
                rafId = requestAnimationFrame(animate)
            }else{
                rafId = null

                if(targetX === 0 && targetY === 0){
                    style.transform = ""
                    btn.__pos = { x:0, y:0 }
                }
            }
        }


        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);

        return () =>{
        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseenter", onMouseEnter);
        container.addEventListener("mouseleave", onMouseLeave);     
        
            if(rafId) cancelAnimationFrame(rafId);
        }
    
        },[])

    return(
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <div className="bg-zinc-900 h-[480px] col justify-between p-8 rounded-3xl shadow-sm">
                        <h2 className="text-6xl uppercase impact text-white shadow-sm">
                            For{" "} 
                            <img 
                            src="/svg/arrow.svg" 
                            alt="" 
                            className="inline-block w-40 ml-5" 
                            />{" "}
                            <br />
                            EVERYONE <br /> BUT <br /> NOT ANYONE
                        </h2>

                        <p className="text-zinc-400">
                            We establish personal relationships with our 
                            boutiques, to make 
                            sure each is vetted for a stress-free shopping 
                            experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative h-[230px] bg-zinc-300 rounded-3xl flex items-end p-3 overflow-clip">
                            <div className="absolute inset-0 bg-[url(/images/port-1.png)] bg-cover bg-top"></div>
                            <span className="bg-zinc-900/70 backdrop-blur-sm text-white font-semibold tracking-wide z-20 px-2 py-1 rounder-full">
                                #RIPSTOP
                            </span>
                        </div>
                        <div className="relative h-[230px] bg-[#586D64] rounded-3xl flex items-end p-3 overflow-clip">
                            <div className="absolute inset-0 bg-[url(/images/port-2.png)] bg-cover bg-top"></div>
                            <span className="bg-zinc-900/70 backdrop-blur-sm text-white font-semibold tracking-wide z-20 px-2 py-1 rounder-full">
                                #INSULATED
                            </span>
                        </div>
                    </div>
                </div>

                <div ref={containerRef} className="relative hidden lg:inline-flex bg-zinc-300 rounded-3xl overflow-hidden">
                    <div className="w-full h-full bg-[url(/images/imgNew.jpeg)] bg-cover flex items-center justify-center text-zinc-500">
                        Image place Holder
                    </div>

                    <div ref={shopButtonRef} className="absolute bottom-80 right-45 size-20 center-item bg-zinc-800/80 backdrop-blur-md text-zinc-500 uppercase rounded-full border border-zinc-100">
                    SHOP <br />
                    NOW
                    </div>

                    <div className="absolute bottom-4 right-4 flex space-x-3">
                        <button className="group bg-white/90 backdrop-blur-xs cursor-pointer centered-row gap-10 text-zinc-900 text-xs uppercase pl-3 pr-2 py-1 rounded-full hover:bg-zinc-900 hover:text-zinc-50 transition-all duration-200 ease-in font-semibold">
                            Learn More

                            <span className="size-8 bg-zinc-800 group-hover:bg-zinc-100 rounded-full center-item">
                                <ArrowDown className="text-zinc-50 group-hover:text-zinc-800"/>
                            </span>
                        </button>

                         <button className="border border-zinc-50 group backdrop-blur-xs cursor-pointer centered-row gap-10 text-zinc-50 text-xs uppercase pl-3 pr-2 py-1 rounded-full hover:bg-zinc-900 hover:text-zinc-50 transition-all duration-200 ease-in font-semibold">
                            Contact Us
                            <span className="size-8 bg-zinc-50 rounded-full center-item">
                                <Mail className="text-zinc-800 w-5"/>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="w-full md:hidden bg-[#586b3f] text-white uppercase p-4 center-item rounded-full">
                    SHOP NOW
                </div>
            </div>
        </div>
    )
}

export default HeroSection;
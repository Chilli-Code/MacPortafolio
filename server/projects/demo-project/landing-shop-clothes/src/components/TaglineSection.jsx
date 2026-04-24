import { Asterisk } from "lucide-react";

const TaglineSection = () =>{

    return(
        <div className="bg-white py-20">
            <div className="relative mx-w-5xl mx-auto px-4 text-center ">
                <div className="absolute hidden md:block size-20 bg--zinc-300 rounded-full left-80 -top-10 overflow-clip">
                    <div className={`size-full bg-[url(/images/port-3.png)] bg-cover bg-top`}>
                    </div>
                </div>

                <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-zinc-900 tracking-tight">
                    Puremoda is pioneering for Elevet Everyday <br />Life, Style change <div className="border w-fit inline-flex items-center border-zinc-600 rounded-full pr-4 pl-2 pb-1">
                        <Asterisk className="inline-block" size={45} /> with seassons</div>, united <br /> by the liberating essence of travel-inspired ligtheartedness
                </h2>

                <div className="absolute overflow-clip size-20 hidden md:block bg-zinc-300 rounded-full left-64 -bottom-4">
                    <div className={`size-full bg-[url(/images/port-5.jpg)] bg-cover bg-top`}></div>
                </div>
                 <div className="absolute overflow-clip size-20 hidden md:block bg-zinc-300 rounded-full right-64 bottom-0">
                    <div className={`size-full bg-[url(/images/port-4.jpg)] bg-cover bg-top`}></div>
                </div>                             
            </div>
        </div>
    );

};

export default TaglineSection;
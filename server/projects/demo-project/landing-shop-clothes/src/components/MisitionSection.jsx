import { Landmark, Zap } from "lucide-react";

const MisitionSection = () => {
    return (
        <div className="py-20 text-white">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-4 items-center">

                <div className="relative h-[620px] bg-zinc-300 rounded-3xl overflow-hidden">
                    <div className="size-full bg-[url(/images/banner.jpg)] bg-cover bg-center flex items-center justify-center text-zinc-500 sature-120">
                    </div>
                    <button className="absolute bottom-4 left-4 bg-white/80 text-zinc-900 text-sm px-4 py-2 rounded-full uppercase hover:bg-zinc-100 transitions-colors">
                        Learn More
                    </button>
                </div>

                <div className="space-y-8 bg-[#586b3f] rounded-3xl h-full lg:col-span-2 flex flex-col justify-between p-8 lg:p-20">
                    <h2 className="text-5xl lg:text-6xl impact text-zinc-100 leading-tight mb-4">
                        WE'RE CHANGING <br /> THE WAY THINGS <br /> GET MADE                        
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6 border-t border-t-[#6d8450] pt-6">
                        <div className="flex items-center space-x-3">
                            <div className="size-10 aspect-square center-item rounded-full bg-zinc-800 p-2">
                                <Zap size={18} className="text-white" />
                            </div>

                            <div>
                                <h3 className="txt-lg uppercase font-bold mb-1">SUSTAINABILITY</h3>

                                <p className="text-zinc-200">
                                    Working alongside international groups of artisan, we create
                                    high-queality products from fantastic materials.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 border-t border-t-[#6d8450] pt-6">
                        <div className="flex items-center space-x-3">
                            <div className="size-10 aspect-square center-item rounded-full bg-zinc-800 p-2">
                                <Landmark size={18} className="text-white" />
                            </div>

                            <div>
                                <h3 className="txt-lg uppercase font-bold mb-1">MISSION</h3>

                                <p className="text-zinc-200">
                                    Working alongside international groups of artisan, we create
                                    high-queality products from fantastic materials.
                                </p>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    );
}

export default MisitionSection;
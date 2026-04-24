
import { filterButtonsData, productData } from "../assets/data";

const ShopSection = () =>{
    return(
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between md:items-center mb-10">
                    <h2 className="text-5xl impact text-zinc-900 mb-4 sm:mb-0">
                        SHOP BY <br /> ESSENTIALS
                    </h2>

                    <div className="flex space-x-4 overflow-x-scroll">
                        {filterButtonsData.map((btn) =>(
                            <button key={btn.name} className={`${btn.isActive ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"} 
                            cursor-pointer md:text-xl impact px-4 py-2 rounded-full hover:bg-zinc-900 uppercase 
                            hover:text-white transition-all duration-200 ease-in group text-nowrap`}>
                                {btn.name}
                                <sub className={`${btn.isActive ? "text-zinc-50" : "text-zinc-800"} text-xs group-hover:text-zinc-50 ml-0.5`}>
                                    {btn.count}
                                </sub>
                            </button>
                        ))}
                    </div> 
                </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {
                                productData.map((product, index) =>(
                                    <div key={index} className="flex flex-col hover:-translate-y-3 transition-all duration-200 ease-in items-start group">
                                        <div className={`relative cursor-pointer w-full ${product.imgHeight} bg-zinc-200
                                        rounded-3xl mb-3 overflow-hidden`}>

                                            <div className={`absolute inset-0 ${product.bgUrl} bg-cover bg-center`}></div>

                                            {product.tag && 
                                                <span className="absolute top-3 left-3 bg-white/80 text-zinc-900 text-xs px-3 py-2 rounded-full">
                                                    {product.tag}
                                                </span>
                                            }

                                            {
                                                product.name === "CARDIGAN" && (
                                                <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/60 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="bg-white text-zinc-900 text-xs px-3 py-1.5 rounded-full hover:bg-zinc-100">
                                                        Add to Cart
                                                    </button>
                                                    <button className="bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-full hover:bg-zinc-700">
                                                        Buy Now
                                                    </button>                                                   
                                                </div>
                                            )}
                                        </div>
                                            <p className="text-3xl impact text-zinc-900">
                                                {product.name}
                                            </p>

                                            <p className="text-xl text-zinc-600">
                                                {product.price}
                                            </p>
                                    </div>
                                ))
                            }
                        </div>

            </div>
        </div>
    );
};

export default ShopSection;
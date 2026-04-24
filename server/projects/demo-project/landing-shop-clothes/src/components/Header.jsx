import { Menu, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { navLinksData } from "../assets/data";

const activeLinkClasses = "border-zinc-400 font-bold"

const Header = () => {
    return(
        <header className="w-full">
            <div className="bg-zinc-900 text-white text-center text-xs py-2">
                Sign up and get 20% off for all new-season collections
            </div>

            <div className="bg-white py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center border border-zinc-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-2">
                        <ShoppingBag />
                        <div className="text-2xl impact tracking-tight text-zinc900">
                            PUREMODA <sup>®</sup>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-4 text-sm font-medium text-zinc-600">
                        {
                            navLinksData.map((link) =>(
                                <a key={link.name} href="#" className={`hover:text-zinc-900 
                                hover:font-bold duration-200 transition-all border border-transparent
                                hover:border-zinc-400 p-2 rounded-full 
                                ${link.isActive && activeLinkClasses}`}>

                                    {link.name}
                                    
                                </a>
                            ))
                        }
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="text-zinc-700 hover:text-zinc-900 transition-colors">
                            <Search size={20}/>
                        </button>
                        <button className="text-zinc-700 hover:text-zinc-900 transition-colors">
                            <User size={20}/>
                        </button>
                        <button className="text-zinc-700 hover:text-zinc-900 transition-colors relative">
                            <ShoppingCart size={20}/>

                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full size-4 center-item">
                                0
                            </span>
                        </button>  

                        <button className="md:hidden text-zinc-700">
                            <Menu size={20} />
                        </button>                                             
                    </div>


                </div>
            </div>
        </header>
    );
}

export default Header;
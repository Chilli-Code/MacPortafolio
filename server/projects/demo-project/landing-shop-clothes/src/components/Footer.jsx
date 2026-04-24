import { Send, ShoppingBag } from "lucide-react";
import FooterLinks from "./FooterLinks";
import { buyingLinksData, productLinksData, socialLinksData } from "../assets/data";
const Footer = () =>{
    
    return(
        <footer className="bg-zinc-900 text-white py-16">

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                <div>
                    <div className="text-4xl text-zinc-100 tracking-tight impact centered-row gap-2 mb-4">
                        <ShoppingBag size={30} className="text-zinc-50 inline-flex"/>{" "} PUREMODA
                        <sup className="-ml-2">®</sup>
                    </div>

                    <p className="text-sm text-zinc-400">FOR EVERYONE BUT NOT ANYOME BUT NOT ANYOME</p>
                </div>

                <div>

                    {
                        productLinksData.map(({title, links}) => (
                            <FooterLinks key={title} title={title} links={links} />
                        ))
                    }

                </div>
                <div>
                    
                    {
                        buyingLinksData.map(({title, links}) => (
                            <FooterLinks key={title} title={title} links={links} />
                        ))
                    }
                </div>
                <div>
                    
                    {
                        socialLinksData.map(({title, links}) => (
                            <FooterLinks key={title} title={title} links={links} />
                        ))
                    }

                                    <h4 className="text-lg mt-2 font-bold mb-4 uppercase">
                    JOIN OUR COMMUNITY
                </h4>

                <form action="" className="flex border border-zinc-600/60 rounded-full p-1 w-fit">
                    <input type="email" placeholder="Email Address" className="flex-1 px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-60" />

                    <button type="submit" className="b-zinc-700 aspect-square text-white p-2 cursor-pointer hover:hue-rotate-30 transition-all rounded-full hover:bg-sinc-600 duration-200 ease-in text-sm">

                        <Send  />
                    </button>
                </form>
                </div>
            </div>

        </footer>
    );
}
export default Footer;
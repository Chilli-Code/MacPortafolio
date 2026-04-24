const FooterLinks = ({ title, links }) => {

    return (
        <>
            <h4 className="text-lg font-bold -mg-4 uppercase">
                {title}
            </h4>

            <ul className="space-y-2 text-sm text-zinc-400">
                {

                    links.map((link, i) => (
                        <li key={i}>
                            <a href="#" className="hover:text-white transition-colors duration-150 ease-in">
                                {link}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </>
    );
}
export default FooterLinks;
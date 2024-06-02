    import { useNavigate } from "react-router-dom"

    import BG_IMAGE from '../../assets/images/undraw-usability-testing.svg'
    import DROPBOX_LOGO from '../../assets/images/dropbox-logo.png'
    import FIREBASE_LOGO from '../../assets/images/firebase-logo.png'
    import LOGO from '../../assets/logo.png'

    const WelcomePage = () => {

        const navigate = useNavigate()

        const handleContinueBtn = (e) => {
            navigate("/upload-method")
        }

        const handleSettingsBtn = (e) => {
            navigate("/admin-access")
        }
        
        return (
            <main className="w-[100vw] h-[100vh]">
                <div className="flex justify-center items-center h-full">
                    <article className="p-10 flex gap-20">
                        <div>
                            <h1 className="text-[4em] text-primary-600 font-bold">WELCOME</h1>
                            <h2 className="text-[2em] text-primary-400">Automated Printing Machine</h2>
                            <p className="text-sm text-gray-500">A self service printing machine provided by <i>EMBEM TRADEWAYS INC.</i> A project made by students of <b>AMA COMPUTER COLLEGE CALOOCAN</b></p>
                            <div className="mt-5">
                                <p className="text-sm text-gray-300">Powered by</p>
                                <ul className="flex gap-2">
                                    <li><img src={LOGO} className="h-10 grayscale" /></li>
                                    <li><img src={DROPBOX_LOGO} className="h-10 grayscale" /></li>
                                    <li><img src={FIREBASE_LOGO} className="h-10 grayscale" /></li>
                                </ul>
                            </div>
                            <div className="flex flex-col w-fit mt-10 gap-2">
                                <button 
                                    className="bg-primary-300 pl-4 pr-4 pt-1 pb-1 rounded-full hover:ring-1 ring-primary-400 text-primary-900 text-lg font-bold" 
                                    onClick={handleContinueBtn}>Continue</button>
                                <button 
                                    className="bg-primary-300 pl-4 pr-4 pt-1 pb-1 rounded-full hover:ring-1 ring-primary-400 text-primary-900 text-lg font-bold flex items-center gap-1" 
                                    onClick={handleSettingsBtn}>Settings</button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img src={BG_IMAGE} />
                        </div>
                    </article>
                </div>
            </main>
        )
    }

    export default WelcomePage;
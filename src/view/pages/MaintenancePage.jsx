import UnderConstructionSVG from "../../assets/images/undraw_under_construction.svg"

const Maintenance = () => {

    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center">
            <img src={UnderConstructionSVG} className="h-[20rem] my-5" />
            <div className="text-center">
                <h1 className="font-bold my-2 text-lg text-primary-500">SORRY FOR YOUR INCONVENIENCE</h1>
                <div className="text-sm text-primary-500">
                    <p>This site is currently under constructions.</p>
                    <p><span className="font-bold italic">Automated Printing Machine</span> will be back soon.</p>
                </div>
            </div>
        </main>
    )
}

export default Maintenance
const Button = ({ IconComponent, text, outlined, onclick }) => {

    if(outlined) {
        return (
            <button className="flex justify-between items-center p-2 border-2 border-green-500 rounded font-bold text-green-500" onClick={onclick}>
                {text}
                {IconComponent && <IconComponent className="ml-2" height={24} />}
            </button>
        )    
    }

    return (
        <button className="flex justify-between items-center p-2 rounded font-bold bg-green-500 text-white" onClick={onclick}>
            {text}
            {IconComponent && <IconComponent className="ml-2" height={24} />}
        </button>
    )

}

export default Button
export default function Button({children, textonly, className, ...props}) {
    let cssClasses = textonly ? `text-button ${className}` : 'button'
    cssClasses += ' ' + className
    return (
        <button className={cssClasses} {...props}>
            {children}
        </button>
    )
}
export function Spinner () {
    return (
        <div className="flex items-center justify-center ">
            <div 
                className="h-14 w-14 animate-spin rounded-full border-8"
                style={{ 
                    borderTopColor: 'var (--primary)', 
                    borderRightColor: 'var (--primary)',
                    borderBottomColor: 'var(--primary)',
                    borderLeftColor: 'var(--muted)',
                }}
            />
        </div>
    )
}
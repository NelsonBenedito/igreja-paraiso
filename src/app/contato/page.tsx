
export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-serif font-bold text-secondary mb-8">Fale Conosco</h1>
            <p className="text-lg text-gray-600">
                Entre em contato conosco para pedidos de oração, dúvidas ou para saber mais sobre nossa igreja.
            </p>
            {/* Form could go here */}
            <div className="mt-8 p-8 bg-muted rounded-xl">
                <p className="font-bold">Email: contato@igrejaparaiso.com.br</p>
                <p className="font-bold">Telefone: (11) 99999-9999</p>
            </div>
        </div>
    );
}

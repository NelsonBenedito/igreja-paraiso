
export default function AboutPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-serif font-bold text-secondary mb-8">Sobre Nós</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        A Igreja Paraíso nasceu com o propósito de levar o evangelho de Cristo a toda criatura.
                        Fundada em 1990, temos servido à comunidade local com amor e dedicação, buscando sempre
                        ser uma igreja relevante e acolhedora.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        Nossa missão é edificar vidas através da Palavra de Deus, promovendo o crescimento espiritual
                        e o serviço ao próximo. Cremos na Bíblia como a única regra de fé e prática, e buscamos viver
                        os ensinamentos de Jesus em nosso dia a dia.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-secondary mt-8 mb-4">Nossa Liderança</h2>
                    <p className="text-gray-700">
                        Liderada pelo Pastor João da Silva, nossa equipe pastoral é dedicada ao cuidado das almas
                        e ao ensino das Escrituras.
                    </p>
                </div>
                <div className="h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                    {/* Placeholder Image */}
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')" }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

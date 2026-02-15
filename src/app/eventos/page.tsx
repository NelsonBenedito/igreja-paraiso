import { Calendar, Clock, MapPin } from "lucide-react";

const EVENTS = [
    {
        id: 1,
        title: "Retiro de Jovens",
        date: "2024-03-24",
        time: "08:00 - 18:00",
        description: "Um dia de muita comunhão e aprendizado para nossos jovens. Traga sua Bíblia e venha preparado para ouvir a voz de Deus.",
        location: "Sítio Recanto da Paz",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Culto de Missões",
        date: "2024-04-05",
        time: "19:00 - 21:00",
        description: "Venha conhecer o trabalho missionário que nossa igreja apoia ao redor do mundo.",
        location: "Templo Principal",
        image: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Escola Bíblica de Férias",
        date: "2024-07-15",
        time: "14:00 - 17:00",
        description: "Atividades especiais para as crianças durante as férias escolares.",
        location: "Salão Social",
        image: "https://images.unsplash.com/photo-1502086223501-6866ba19d854?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function EventsPage() {
    return (
        <div className="bg-muted/30 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">Próximos Eventos</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Fique por dentro de tudo o que acontece na Igreja Paraíso. Participe e traga sua família!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {EVENTS.map((event) => (
                        <div key={event.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col">
                            <div
                                className="h-48 w-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${event.image}')` }}
                            ></div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                                    <Calendar size={16} />
                                    <span>{new Date(event.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-secondary mb-3">{event.title}</h3>
                                <p className="text-muted-foreground mb-6 flex-grow">{event.description}</p>

                                <div className="space-y-2 mb-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-accent" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-accent" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-secondary text-white rounded-md hover:bg-opacity-90 transition-colors font-medium">
                                    Inscrever-se
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

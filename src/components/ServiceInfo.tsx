'use client';
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { SERVICE_TIMES } from '../constants';

const ServiceInfo: React.FC = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4 block">Nossa Agenda</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">Participe dos nossos <br />encontros presenciais</h2>
                        <p className="text-lg text-gray-600 mb-10">
                            Acreditamos na comunhão e no poder do encontro. Nossas celebrações são pensadas para toda a família, com mensagens relevantes e adoração genuína.
                        </p>

                        <div className="space-y-6">
                            {SERVICE_TIMES.map((service, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{service.type}</h4>
                                        <p className="text-gray-500">{service.day}, às {service.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1544427928-c49cdfebf494?auto=format&fit=crop&q=80&w=1200"
                            alt="Localização"
                            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                            <div className="flex items-center gap-3 text-white mb-2">
                                <MapPin className="w-6 h-6 text-indigo-400" />
                                <span className="text-xl font-bold">Onde Estamos</span>
                            </div>
                            <p className="text-gray-200 text-lg">Av. Central da Cidade, 1000 - Centro, São José dos Campos - SP</p>
                            <button className="mt-6 w-full py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                                Ver no Google Maps
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceInfo;

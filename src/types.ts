export interface NavItem {
    label: string;
    href: string;
}

export interface ServiceTime {
    day: string;
    time: string;
    type: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    image: string;
}

export interface Ministry {
    id: string;
    name: string;
    description: string;
    image: string;
    icon: string;
}

export interface Mission {
    id: string;
    name: string;
    role: string;
    location: string;
    image: string;
}

export interface Sermon {
    id: string;
    title: string;
    preacher: string;
    date: string;
    thumbnail: string;
    category: string;
}

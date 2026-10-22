import { describe, expect, it } from "vitest";
import { buildContactView } from "./view";
import { SITE_CONTENT_FALLBACK } from "@/lib/site-content/fallbacks";
import type { SiteSections, SiteChurch } from "@/lib/site-content/types";
import type { SiteSchedule } from "@/lib/events/types";

const church = (o: Partial<SiteChurch>): SiteChurch => ({
  name: "X", location: "", address: "", image: "", mapsUrl: "", isHeadquarters: false, active: true, ...o,
});
const sched = (o: Partial<SiteSchedule>): SiteSchedule => ({
  id: "1", title: "Culto", day_of_week: "Domingo", time_start: "18:00:00", location: null, description: null, active: true, sort_order: 0, ...o,
});
const sections = (contact: Partial<SiteSections["contact"]>, items: SiteChurch[] = []): SiteSections => ({
  ...SITE_CONTENT_FALLBACK,
  contact: { ...SITE_CONTENT_FALLBACK.contact, ...contact },
  churches: { ...SITE_CONTENT_FALLBACK.churches, items },
});

describe("buildContactView", () => {
  it("API fora: nada é exibido", () => {
    expect(buildContactView(null, [])).toEqual({
      address: null, phone: null, phoneHref: null, email: null, mapsUrl: null, schedules: [],
    });
  });

  it("usa contact.*, mapsUrl da sede ativa e horários ativos ordenados", () => {
    const v = buildContactView(
      sections({ phone: "(27) 99875-7008", email: "a@b.com", address: "Rua A, 1" }, [
        church({ mapsUrl: "https://maps.example/filial" }),
        church({ isHeadquarters: true, mapsUrl: "https://maps.example/sede" }),
      ]),
      [
        sched({ id: "q", day_of_week: "Quinta-feira", time_start: "19:30:00", title: "Maná" }),
        sched({ id: "x", active: false }),
        sched({ id: "d", title: "Celebração" }),
      ],
    );
    expect(v).toMatchObject({
      address: "Rua A, 1", phone: "(27) 99875-7008", phoneHref: "tel:+5527998757008",
      email: "a@b.com", mapsUrl: "https://maps.example/sede",
    });
    expect(v.schedules.map((s) => [s.day, s.time, s.title])).toEqual([
      ["Domingo", "18:00", "Celebração"], ["Quinta-feira", "19:30", "Maná"],
    ]);
  });

  it("campos vazios somem; sem sede ou URL inválida não há mapa", () => {
    const v = buildContactView(
      sections({ phone: " ", email: "", address: "" }, [church({ isHeadquarters: true, mapsUrl: "javascript:alert(1)" })]),
      [],
    );
    expect(v).toMatchObject({ address: null, phone: null, phoneHref: null, email: null, mapsUrl: null });
    expect(buildContactView(sections({}, [church({ mapsUrl: "https://m.example" })]), []).mapsUrl).toBeNull();
  });
});

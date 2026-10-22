import { describe, expect, it } from "vitest";
import { buildRemotePatterns, parseMediaHostnames } from "./remote-patterns";

const defaults = ["images.unsplash.com", "upload.wikimedia.org"];
const hosts = (raw?: string) => buildRemotePatterns(raw).map((p) => p.hostname);

describe("buildRemotePatterns", () => {
  it("sem variável mantém só os hosts atuais", () => {
    expect(hosts(undefined)).toEqual(defaults);
    expect(hosts("")).toEqual(defaults);
  });

  it("acrescenta hosts válidos, em https e com pathname livre", () => {
    const patterns = buildRemotePatterns("pub-abc123.r2.dev, midia.igreja.org");
    expect(patterns.map((p) => p.hostname)).toEqual([...defaults, "pub-abc123.r2.dev", "midia.igreja.org"]);
    expect(patterns.every((p) => p.protocol === "https" && p.pathname === "/**")).toBe(true);
  });

  it("aceita https:// e ignora http://, caminhos, portas e lixo", () => {
    expect(parseMediaHostnames("https://a.r2.dev/")).toEqual(["a.r2.dev"]);
    expect(
      parseMediaHostnames("http://x.r2.dev,b.r2.dev/path,c.r2.dev:8080,semponto,*,**.evil,ok.r2.dev"),
    ).toEqual(["ok.r2.dev"]);
  });

  it("não duplica hosts", () => {
    expect(hosts("images.unsplash.com,a.r2.dev,a.r2.dev")).toEqual([...defaults, "a.r2.dev"]);
  });
});

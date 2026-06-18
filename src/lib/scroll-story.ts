"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Group, PerspectiveCamera } from "three";
import type { SceneState } from "@/components/three/sceneStates";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollStoryParams = {
  camera: PerspectiveCamera;
  monolith: Group;
  story: {
    monolithOpacity: number;
    particlesSpeed: number;
    particlesOpacity: number;
    bloom: number;
  };
  states: Record<string, SceneState>;
  reducedMotion: boolean;
};

export function setupScrollStory({
  camera,
  monolith,
  story,
  states,
  reducedMotion,
}: ScrollStoryParams) {
  if (reducedMotion) {
    const hero = states.hero;
    camera.position.set(...hero.camera.position);
    camera.rotation.set(...hero.camera.rotation);
    monolith.position.set(...hero.monolith.position);
    monolith.rotation.set(...hero.monolith.rotation);
    story.monolithOpacity = hero.monolith.opacity;
    story.particlesOpacity = hero.particles.opacity;
    story.particlesSpeed = hero.particles.speed;
    story.bloom = hero.bloom;
    return () => undefined;
  }

  const sections = [
    { id: "#hero", state: states.hero },
    { id: "#projects", state: states.projects },
    { id: "#skills", state: states.skills },
    { id: "#experience", state: states.experience },
    { id: "#contact", state: states.contact },
  ].filter(({ id }) => typeof document !== "undefined" && document.querySelector(id));

  gsap.set(camera.position, { x: states.hero.camera.position[0], y: states.hero.camera.position[1], z: states.hero.camera.position[2] });
  gsap.set(camera.rotation, { x: states.hero.camera.rotation[0], y: states.hero.camera.rotation[1], z: states.hero.camera.rotation[2] });
  gsap.set(monolith.position, { x: states.hero.monolith.position[0], y: states.hero.monolith.position[1], z: states.hero.monolith.position[2] });
  gsap.set(monolith.rotation, { x: states.hero.monolith.rotation[0], y: states.hero.monolith.rotation[1], z: states.hero.monolith.rotation[2] });
  gsap.set(story, {
    monolithOpacity: states.hero.monolith.opacity,
    particlesOpacity: states.hero.particles.opacity,
    particlesSpeed: states.hero.particles.speed,
    bloom: states.hero.bloom,
  });

  const triggers = sections.map(({ id, state }) =>
    gsap.timeline({
      scrollTrigger: {
        trigger: id,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
      .to(camera.position, {
        x: state.camera.position[0],
        y: state.camera.position[1],
        z: state.camera.position[2],
        ease: "none",
        duration: 1,
      })
      .to(camera.rotation, {
        x: state.camera.rotation[0],
        y: state.camera.rotation[1],
        z: state.camera.rotation[2],
        ease: "none",
        duration: 1,
      }, 0)
      .to(monolith.position, {
        x: state.monolith.position[0],
        y: state.monolith.position[1],
        z: state.monolith.position[2],
        ease: "none",
        duration: 1,
      }, 0)
      .to(monolith.rotation, {
        x: state.monolith.rotation[0],
        y: state.monolith.rotation[1],
        z: state.monolith.rotation[2],
        ease: "none",
        duration: 1,
      }, 0)
      .to(story, {
        monolithOpacity: state.monolith.opacity,
        particlesOpacity: state.particles.opacity,
        particlesSpeed: state.particles.speed,
        bloom: state.bloom,
        ease: "none",
        duration: 1,
      }, 0),
  );

  return () => {
    triggers.forEach((tl) => tl.scrollTrigger?.kill());
    triggers.forEach((tl) => tl.kill());
  };
}

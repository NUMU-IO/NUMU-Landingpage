import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: string[];
}

const Ballpit: React.FC<BallpitProps> = ({
  count = 50,
  gravity = 0.5,
  friction = 0.9,
  wallBounce = 0.9,
  followCursor = true,
  colors = ["#ff0000", "#00ff00", "#0000ff"],
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Composite = Matter.Composite,
      Common = Matter.Common;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Set gravity
    engine.world.gravity.y = gravity;

    // Get dimensions
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // Create walls
    const wallOptions = {
      isStatic: true,
      render: { visible: false },
      restitution: wallBounce,
    };

    const ground = Bodies.rectangle(width / 2, height + 50, width + 200, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height + 200, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height + 200, wallOptions);
    
    World.add(engine.world, [ground, leftWall, rightWall]);

    // Create balls
    const balls: Matter.Body[] = [];
    for (let i = 0; i < count; i++) {
      const radius = Common.random(10, 30);
      const x = Common.random(50, width - 50);
      const y = Common.random(-500, -50); // Start above

      const ball = Bodies.circle(x, y, radius, {
        restitution: 0.9,
        friction: 0.001,
        // Assuming friction prop is velocity retention (0-1), frictionAir is 1 - retention
        frictionAir: (1 - friction) * 0.1, 
        render: {
          fillStyle: colors[Math.floor(Math.random() * colors.length)],
        },
      });
      balls.push(ball);
    }
    World.add(engine.world, balls);

    // Add mouse control
    if (followCursor) {
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });
      World.add(engine.world, mouseConstraint);
      render.mouse = mouse;
    }

    // Run
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current || !render.canvas) return;
      
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;

      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;

      // Update walls
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
      
      // We should also scale the ground width if needed, but for now position update is key
      // Re-creating walls is safer for width changes but more complex to manage state
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) {
        render.canvas.remove();
      }
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [count, gravity, friction, wallBounce, followCursor, colors]);

  return <div ref={sceneRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
};

export default Ballpit;

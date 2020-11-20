Project 3
Charly Yan Miller

Overview of game:
In this game a player can explore an infinite field of gemoetric shapes which produce and vibrate
to various tones, drones, textures... Each shape features unique 2D geometries,
patterns of lines, colour and sounds.
Design Rational:
I haven't played many games this semester (besides Lol), but the games I have played tended to less
mechanically and narratively driven and more interested in exploring the potential experiences
players can have within 3D spaces. In many ways these games really remind me of installations.
I wanted to see if I could make an interesting virtual space of my own, but I really wanted
to focus on developing coding skills and therefore wanted to procedurally generate rather than
meticulously design the world. If the world consisted of self contained objects rather than
scenes which relied heavily on the relationship between objects then I thought this
might be realistically achievable with my current knowledge of coding. I also knew
that sound was incredibly important to a player's experience of a virtual space and
therefore the sound of this space would have to be an emphasis in the project.
I was also influenced by the scene in 2001 space odyssey where the tribe of hominids
come across the monolith whose presence and power is conveyed through the music/sound which it radiates.
Tech Overview (for more detailed overviews you can go back to my exercise 7 and 8):

Visualization:
I this project I used ray tech developed in project 2 for my pong-light game, basically
I spawn a ray for every vertex (2D) in the scene, make its origin the player's position and then make
the ray point towards its associated vertex. When the ray collides with a line (lines make up shapes)
then I stored the position of the collision and the height, colour and alpha of the line
at that point of collision. I then find the ray marking the start of the FOV, i itterate through rays
by their angle until I reach the ray marking the end of the FOV all the while filling in shapes
using the rays' collision information as the input. The closer the collision occurs, the "taller"
I draw the shapes on the screen, this creates the illusion of perspective.
Sound:
Every shape's vertex has its own childed source or speaker which has a proecudrally generated
sound and which also effects the vertex's height and therefore makes it "vibrate".
The procedurally generated sound is created because every source during initialization
has a unique range of pitches, wavetypes, and fadetypes which are selected which give a unique sound.
On the type of perspective being created:
I key thing to note is that one of the main reasons that the perspective doesn't feel quite realistic
in the game is that the perceived height of any given line at any given point of contact with a ray
increases LINEARLY as the player approaches said line. This means that the height of a shape
can actually reach and go below zero if the player is far enough away from a shape.
This is why shapes in the game spring out of existence from a faint sillouhette, because
of the linear perspective their heights would naturally be lower than zero past a certain distance from the player.
Personally I love this effect which is why I chose to model perspective this way,
it creates a sense of intimacy with the closest shape in the player's immediate sourrondings as all
other shapes are relegated to appearing as mere black lines on the horizon (fog might function similarily).
(i think if you were to graph the relationship "f(distanceToShape) = height" of a realistic perspective matrix it would
take the form f = a/x (a rational function approaching but never reaching zero)
instead of the current linear relationship f = ax which intersects and goes past y=0)
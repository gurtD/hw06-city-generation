Garrett Darley, gdarley

https://gurtd.github.io/hw06-city-generation/

Using the same noise functions from my previous assignment, I draw the terrain
on a square mesh. The lighter the color means the higher the elevation, with 
water being blue and land being green. On the gpu and the cpu I create a 2d
grid that can be seen on the terrain, I then create 100 random points within 
the grid. When creating the 2d points I check to see if within the grid 
square there is water and if there is, change the 2d point to some other 
randomly chosen point. The height of this point is chosen based off
of the noise function i used for population density in the previous assignment.
If the density is higher the point will be higher off the ground, which leads 
to the next point. The building of the geometry is based of the coordinates 
generated, with the x and z point dictating where in space it will build and 
the y coordinating how high the building will be. I use the mesh that I have
and stack it on top of one another until we reach the height of the y 
changing the scale along the way. This way we have higher buildings in more
densely populated areas and lower buildings in less populated areas. We do 
this for all the generated points and send the info to the instanced shader. 
As for the buildings texture, we create a bunch of rectangles on them to 
simulate windows on the whole surface. For the artistic lighting I 
implemented lambert shading on the buildings. As for the procedural sky, I 
used fbm to create a cloudy looking sky. 



	

	


// TODO, Clearly not the proper place for this, but it is used by UI class also
function updatePath() {
	ASTAR.length = 0;
	var list = g.arena.aStar(START, DESTINATION);
	for (var i = 0; i < list.length; i++)
	{
		ASTAR.push(list[i]);
	}
	if (DEBUG)
	{
		log(ASTAR);
	}
}

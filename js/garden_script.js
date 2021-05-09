$(function(){
    
    $(".asset").draggable();

    //collect + zip

    let downloadUrls=[];

    $(".assetimage").dblclick(function(){

        if( !$(this).hasClass('used')){
            if(downloadUrls.length<5){
                $(this).clone().css({"max-height":"9vh","max-width":"9vh","margin-top":"3vh","margin-right":"1vw"}).appendTo(".assetblock");
                let addUrl = $(this).find('a').attr('href');
                downloadUrls.push(addUrl);
                setupDownload();
                $(this).addClass('used');
            }else{
                alert("You could only collect FIVE assets!");
            }
        }

    });

    function setupDownload(){
        if (downloadUrls.length > 0){
            $(".button").addClass('active');
        }
        else{
            $(".button").removeClass('active');
        }
    }

    $(".download").click(function(){
        if($(".button").hasClass('active')){
            saveToZip('world_assets.zip', downloadUrls);
            alert("Your assets are being downloaded. \r\nGood luck on your future journey. You are now ready to go!");
        }
    });

    function saveToZip (filename, urls){
        const zip = new JSZip()
        const folder = zip.folder('world_assets')
        urls.forEach((url)=> {
            const blobPromise = fetch(url).then(r => {
                if (r.status === 200) return r.blob()
                return Promise.reject(new Error(r.statusText))
            })
        const name = url.substring(url.lastIndexOf('/'))
        folder.file(name, blobPromise)
        })

        zip.generateAsync({type:"blob"})
            .then(blob => saveAs(blob, filename))
            .catch(e => console.log(e));
        }

        $(".refresh").click(function(){         //empty assetblock
            $(".assetblock").empty();
            $(".assetimage").removeClass('used');
            $(".button").removeClass('active');
            downloadUrls = [];
        });

    var edgeSizea = 240;
    var edgeSizeb = 480;
    var timer = null;

    window.addEventListener( "mousemove", handleMousemove, false );

    drawGridLines();

    function handleMousemove( event ) {

        var viewportX = event.clientX;
        var viewportY = event.clientY;

        // Get the viewport dimensions.
        var viewportWidth = document.documentElement.clientWidth;
        var viewportHeight = document.documentElement.clientHeight;

        var edgeTop = edgeSizea;
        var edgeLeft = edgeSizeb;
        var edgeBottom = ( viewportHeight - edgeSizea );
        var edgeRight = ( viewportWidth - edgeSizeb );

        var isInLeftEdge = ( viewportX < edgeLeft );
        var isInRightEdge = ( viewportX > edgeRight );
        var isInTopEdge = ( viewportY < edgeTop );
        var isInBottomEdge = ( viewportY > edgeBottom );

        if ( ! ( isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge ) ) {

            clearTimeout( timer );
            return;
        }

        var documentWidth = Math.max(
            document.body.scrollWidth,
            document.body.offsetWidth,
            document.body.clientWidth,
            document.documentElement.scrollWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
        var documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.body.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight
        );

        var maxScrollX = ( documentWidth - viewportWidth );
        var maxScrollY = ( documentHeight - viewportHeight );

        (function checkForWindowScroll() {

            clearTimeout( timer );

            if ( adjustWindowScroll() ) {

                timer = setTimeout( checkForWindowScroll, 30 );

            }

        })();

        function adjustWindowScroll() {

            // Get the current scroll position of the document.
            var currentScrollX = window.pageXOffset;
            var currentScrollY = window.pageYOffset;

            // Determine if the window can be scrolled in any particular direction.
            var canScrollUp = ( currentScrollY > 0 );
            var canScrollDown = ( currentScrollY < maxScrollY );
            var canScrollLeft = ( currentScrollX > 0 );
            var canScrollRight = ( currentScrollX < maxScrollX );

            var nextScrollX = currentScrollX;
            var nextScrollY = currentScrollY;

            var maxStep = 14;

            // Should we scroll left?
            if ( isInLeftEdge && canScrollLeft ) {

                var intensity = ( ( edgeLeft - viewportX ) / edgeSizeb );

                nextScrollX = ( nextScrollX - ( maxStep * intensity ) );

            // Should we scroll right?
            } else if ( isInRightEdge && canScrollRight ) {

                var intensity = ( ( viewportX - edgeRight ) / edgeSizeb );

                nextScrollX = ( nextScrollX + ( maxStep * intensity ) );

            }

            // Should we scroll up?
            if ( isInTopEdge && canScrollUp ) {

                var intensity = ( ( edgeTop - viewportY ) / edgeSizea );

                nextScrollY = ( nextScrollY - ( maxStep * intensity ) );

            // Should we scroll down?
            } else if ( isInBottomEdge && canScrollDown ) {

                var intensity = ( ( viewportY - edgeBottom ) / edgeSizea );

                nextScrollY = ( nextScrollY + ( maxStep * intensity ) );

            }

            nextScrollX = Math.max( 0, Math.min( maxScrollX, nextScrollX ) );
            nextScrollY = Math.max( 0, Math.min( maxScrollY, nextScrollY ) );

            if (
                ( nextScrollX !== currentScrollX ) ||
                ( nextScrollY !== currentScrollY )
                ) {

                window.scrollTo( nextScrollX, nextScrollY );
                return( true );

            } else {

                return( false );

            }

        }

    }
});
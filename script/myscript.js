function addEvent(element, event, delegate) {
    if (typeof (window.event) != 'undefined' && element.attachEvent) element.attachEvent('on' + event, delegate);
    else element.addEventListener(event, delegate, false);
}

addEvent(document, 'readystatechange', function () {
    if (document.readyState !== "complete") return true;

    var items = document.querySelectorAll("section.products ul li");
    var cart = document.querySelectorAll("#cart ul")[0];

    function updateCart() {
        var total = 0.0;
        var cart_items = document.querySelectorAll("#cart ul li")
        for (var i = 0; i < cart_items.length; i++) {
            var cart_item = cart_items[i];
            var quantity = cart_item.getAttribute('data-quantity');
            var price = cart_item.getAttribute('data-price');

            var sub_total = parseFloat(quantity * parseFloat(price));
            cart_item.querySelectorAll("span.sub-total")[0].innerHTML = " = " + sub_total.toFixed(2);

            total += sub_total;
        }

        document.querySelectorAll("#cart span.total")[0].innerHTML = total.toFixed(2);
    }

    function addCartItem(item, id) {
        var clone = item.cloneNode(true);
        clone.setAttribute('data-id', id);
        clone.setAttribute('data-quantity', 1);
        clone.removeAttribute('id');

        var btn = document.createElement('button');
        var t = document.createTextNode("remove");
        btn.appendChild(t);


        var fragment = document.createElement('span');
        fragment.setAttribute('class', 'quantity');
        fragment.innerHTML = ' x 1';
        clone.appendChild(fragment);

        fragment = document.createElement('span');
        fragment.setAttribute('class', 'sub-total');
        clone.appendChild(fragment);
        cart.appendChild(clone);

        clone.appendChild(btn);
        btn.onclick = function () {
            var quantity1 = clone.getAttribute('data-quantity');
            //alert(quantity1);
            if (quantity1 === '1') {
                cart.removeChild(clone);
                updateCart();
            } else {
                quantity1 = parseInt(quantity1) - 1;
                clone.setAttribute('data-quantity', quantity1);
                var span = clone.querySelectorAll('span.quantity')[0].innerHTML = ' x ' + quantity1;
                updateCart();
            }
        };
    }

    function updateCartItem(item) {
        var quantity = item.getAttribute('data-quantity');
        quantity = parseInt(quantity) + 1
        item.setAttribute('data-quantity', quantity);
        var span = item.querySelectorAll('span.quantity');
        span[0].innerHTML = ' x ' + quantity;
    }

    function onDrop(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;

        var id = event.dataTransfer.getData("Text");
        var item = document.getElementById(id);

        var exists = document.querySelectorAll("#cart ul li[data-id='" + id + "']");

        if (exists.length > 0) {
            updateCartItem(exists[0]);
        } else {
            addCartItem(item, id);
        }

        updateCart();

        return false;
    }

    function onDragOver(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        return false;
    }

    addEvent(cart, 'drop', onDrop);
    addEvent(cart, 'dragover', onDragOver);

    function onDrag(event) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        var target = event.target || event.srcElement;
        var success = event.dataTransfer.setData('Text', target.id);
    }


    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.setAttribute("draggable", "true");
        addEvent(item, 'dragstart', onDrag);
    };
});

function store() {
    var products = [];
    var cart_items = document.querySelectorAll("#cart ul li")
    for (var i = 0; i < cart_items.length; i++) {
        var cart_item = cart_items[i];
        var prodtId = cart_items[i].childNodes[1].innerText;
        var prodtnm = cart_items[i].childNodes[3].innerText;
        var quantity = cart_item.getAttribute('data-quantity');
        var price = cart_item.getAttribute('data-price');

        var sub_total = parseFloat(quantity * parseFloat(price));

        products.push({
            id: prodtId,
            name: prodtnm,
            quantity: quantity,
            price: price,
            subtotal: sub_total
        });
    }
    //localStorage.setItem('productsInfo', JSON.stringify(products));

    var oldItems = JSON.parse(localStorage.getItem('productsInfo')) || [];

    oldItems.push(products);

    localStorage.setItem('productsInfo', JSON.stringify(oldItems));
    document.location.href="display.html";
}
function load(){

      var localhtml = "";

      //localStorage key and getItembr
      for (var i = 0; i < localStorage.length; i++) {
          localhtml += "<li>" + localStorage.key(i) + " " +
              localStorage.getItem(localStorage.key(i)) + "</li>";
      }

          document.getElementById('result').innerHTML = localhtml;                         

}

function clr()
{
                 //alert('good');
                 localStorage.removeItem('productsInfo');
	document.location.href="index.html";
}

function shop()
{
	document.location.href="index.html";
}
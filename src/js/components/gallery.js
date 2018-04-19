angular.module('app').component('gallery', {
    templateUrl: 'js/components/gallery.html',
    controller: ['$scope', '$cookies', 'config', function ($scope, $cookies, config) {
        vm = this;
        vm.tabs = {};
        vm.toggleTabs = {};
        vm.search = '';
        vm.showFeatured = true;
        vm.showFavorites = false;
        vm.maps = [];
        
        vm.showGISLinks = false;
        vm.restoreTabKey="general";
        vm.searchLabel = 'Filter'
        vm.showSearchResults = false;
        vm.linkCategoryList = {"Department of Aviation": [], "City of Atlanta": [] , "Georgia": [], "Regional/Federal":[]};
        vm.showGISLinks = false;
        // Contacts link
        vm.loadContacts = function() {
            $('#contactsLink')[0].click();
        }

        //  get list of user favorite maps
        var cookieVal = $cookies.getObject('atl-gallery-map') || {};

        config.then(function (data, cookieVal) {
            $scope.$apply(function () {
                vm.tabs = data.tabs;
                vm.maps = data.maps;
                vm.initializeTabsData();
                vm.initializeFavorites();
                vm.initializeListCategories();                
            });
        });

        vm.initializeTabsData = function () {
            angular.forEach(vm.tabs, function (tag, key) {
                vm.toggleTabs[key] = {
                    toggled: false
                };
            });
        };

        vm.initializeFavorites = function () {
            angular.forEach(vm.maps, function (map, i) {
                map.favorite = (typeof cookieVal[map.id] != 'undefined') ? cookieVal[map.id] : false;
            });
        };

        vm.initializeListCategories = function() { 
            angular.forEach(vm.maps, function (map, i) { 
                for (const category in vm.linkCategoryList) {
                    if (category == map.linkCategory) {
                       vm.linkCategoryList[category].push(map) ; 
                    }
                }
            })
        };
          
        vm.mapsFilter = function (map, i, maps) {
            if (map.hidden) return false; 
            var toggled = false;
            if (vm.showFavorites && map.favorite) toggled = true;
            if (vm.showFeatured && map.featured) toggled = true;
            angular.forEach(vm.toggleTabs, function (isToggled, key) {
                if (!toggled) toggled = isToggled.toggled && map.tabs.indexOf(vm.tabs[key]) > -1;
            });
            if (toggled && vm.search != '') {  
                var toggleSearch = false;
                angular.forEach(map.keywords, function (word, key) { 
                    if (!toggleSearch) toggleSearch = word.toLowerCase().indexOf(vm.search.toLowerCase()) > -1;
                });
                toggled = toggleSearch;
            }
            return toggled;
        };

        vm.filteredMaps = function () {
            var filteredMaps = [];
            angular.forEach(vm.maps, function (map) {
                if (vm.mapFilter(map)) {
                    filteredMaps.push(map);
                }
            });
            return filteredMaps;
        };
        vm.toggle = function (e) {
            var tagKey = $(e.target).data('tag');
            vm.clearSearch(); 
            vm.showFavorites = (tagKey == 'showFavorites');
            vm.showFeatured = (tagKey == 'showFeatured');
            vm.showGISLinks = (tagKey == 'links');
            vm.showSearchResults = (vm.searchLabel == 'Clear Filter');
            (tagKey == 'links') ? $("#search-group").hide() : $("#search-group").show(); //hides search on link page
            vm.showContacts = (tagKey == 'showContacts')
            angular.forEach(vm.toggleTabs, function (tag, key) {
            tag.toggled = (key == tagKey);  
            });
        };
        vm.searchChange = function () {
            vm.searchLabel = vm.search.length == 0 ? 'Filter' : 'Clear Filter';
            vm.showSearchResults = true;
            //get current tab to return to later
            vm.getRestoreTabKeyTab();
            vm.toggleTabs['general'] = {toggled: true };
        }; 

        vm.getRestoreTabKeyTab = function(){
            if (vm.showFavorites) vm.restoreTabKey = "showFavorites";
            else if (vm.showFeatured) vm.restoreTabKey = "showFeatured";
            else {
                angular.forEach(vm.tabs, function (tag, key) {
                    if ( vm.toggleTabs[key].toggled == true) vm.restoreTabKey = key;    
                });
            }
        };
        
        vm.setSearchActiveTab = function(key){
            if (vm.showSearchResults == false) return vm.toggleTabs[key].toggled; // not searching so carry on
            else if (vm.restoreTabKey == key) return true;  // 
            else return false;
        };

        vm.clearSearch = function() {
            if (vm.searchLabel == 'Clear Filter') {
                vm.search = '';
                vm.showSearchResults = false;
                vm.searchLabel = "Filter";
                vm.toggleTabs['general'] = {toggled: false };
                if (vm.restoreTabKey == "showFavorites") vm.showFavorites = true;
                else if (vm.restoreTabKey == "showFeatured") vm.showFeatured = true;
                else vm.toggleTabs[vm.restoreTabKey] = {toggled: true }; 
            };
        };
             
        vm.toggleFavorite = function (mapItem) {    
            expDate = new Date();
            expDate.setDate(expDate.getDate() + 365); // cookie expiration date
            mapItem.favorite = !mapItem.favorite;
            cookieVal[mapItem.id] = mapItem.favorite;
            $cookies.putObject('atl-gallery-map', cookieVal, {expires : expDate});
        };
        vm.mouseOver = function (mapItem) {
            $('.masonry-grid [data-id=' + mapItem.id + '] .grid-item-gradient').addClass('grow');
            $('.masonry-grid [data-id=' + mapItem.id + '] img').removeClass('gray');
            $('.masonry-grid [data-id=details_' + mapItem.id + ']').removeClass('hidden');
        };
        vm.mouseLeave = function (mapItem) {
            $('.masonry-grid [data-id=' + mapItem.id + '] .grid-item-gradient').removeClass('grow');
            $('.masonry-grid [data-id=' + mapItem.id + '] img').addClass('gray');
            $('.masonry-grid [data-id=details_' + mapItem.id + ']').addClass('hidden');
        };
    }]
});
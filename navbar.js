d3.select("#navbar")
    .attr("class", "navbar fixed-top navbar-expand-lg navbar-dark bg-dark");

d3.select("#navbar")
    .append("a")
    .attr("class", "navbar-brand")
    .attr("href", "/")
    .attr("id", "nav-header");

d3.select("#nav-header")
    .append("div")
    .attr("class", "nav_text")
    .text("Kenneth Fries");

d3.select("#navbar")
    .append("button")
    .attr("class", "navbar-toggler")
    .attr("type", "button")
    .attr("data-toggle", "collapse")
    .attr("aria-controls", "navbarSupportedContent")
    .attr("aria-expanded", "false")
    .attr("aria-label", "Toggle navigation")
    .attr("data-target", "#navbarSupportedContent");

d3.select(".navbar-toggler")
    .append("span")
    .attr("class", "navbar-toggler-icon");

d3.select("#navbar")
    .append("div")
    .attr("class", "collapse navbar-collapse")
    .attr("id", "navbarSupportedContent");

d3.select("#navbarSupportedContent")
    .append("ul")
    .attr("class", "navbar-nav mr-auto");

d3.select("#navbarSupportedContent").select("ul")
    .append("li")
    .attr("class", "nav-item active")
    .attr("id", "nav-item-1");

d3.select("#nav-item-1")
    .append("a")
    .attr("class", "nav-link")
    .attr("href", "https://www.linkedin.com/in/kennethfries/")
    .text("LinkedIn");

d3.select("#nav-item_1").select("a")
    .append("span")
    .attr("class", "sr-only")
    .text("(current)")

d3.select("#navbarSupportedContent").select("ul")
    .append("li")
    .attr("class", "nav-item")
    .attr("id", "nav-item-2");

d3.select("#nav-item-2")
    .append("a")
    .attr("class", "nav-link")
    .attr("href", "/Covid/covid.html")
    .text("Covid 19");

d3.select("#navbarSupportedContent").select("ul")
    .append("li")
    .attr("class", "nav-item")
    .attr("id", "nav-item-3");

d3.select("#nav-item-3")
    .append("a")
    .attr("class", "nav-link")
    .attr("href", "https://github.com/Kenneth-Fries")
    .text("Github");
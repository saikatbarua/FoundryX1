﻿

var foApp = angular.module('locations', []);

// Alignment enums

THREE.SpriteAlignment = {};
THREE.SpriteAlignment.topLeft = new THREE.Vector2(1, -1);
THREE.SpriteAlignment.topCenter = new THREE.Vector2(0, -1);
THREE.SpriteAlignment.topRight = new THREE.Vector2(-1, -1);
THREE.SpriteAlignment.centerLeft = new THREE.Vector2(1, 0);
THREE.SpriteAlignment.center = new THREE.Vector2(0, 0);
THREE.SpriteAlignment.centerRight = new THREE.Vector2(-1, 0);
THREE.SpriteAlignment.bottomLeft = new THREE.Vector2(1, 1);
THREE.SpriteAlignment.bottomCenter = new THREE.Vector2(0, 1);
THREE.SpriteAlignment.bottomRight = new THREE.Vector2(-1, 1);



(function (app, fo, undefined) {


    var camera, scene, renderer, controls;
    var geometry, material, mesh;
    var allItems = [];
    var group;

    var countryColor = [
    { "countryCode": "BR", "color": "#2fbca9" },
{ "countryCode": "CN", "color": "#e8e483" },
{ "countryCode": "CN", "color": "#076012" },
{ "countryCode": "SE", "color": "#54fe8e" },
{ "countryCode": "CN", "color": "#78f0f6" },
{ "countryCode": "CN", "color": "#86a88b" },
{ "countryCode": "JP", "color": "#8e731f" },
{ "countryCode": "CN", "color": "#6f18c3" },
{ "countryCode": "BR", "color": "#c709e1" },
{ "countryCode": "PE", "color": "#75ded1" },
{ "countryCode": "ZA", "color": "#3c062b" },
{ "countryCode": "CN", "color": "#5dc6af" },
{ "countryCode": "PS", "color": "#2e57f9" },
{ "countryCode": "BR", "color": "#dc1b27" },
{ "countryCode": "AM", "color": "#fafcff" },
{ "countryCode": "US", "color": "#c2a3fd" },
{ "countryCode": "ID", "color": "#b2f321" },
{ "countryCode": "PT", "color": "#0867b9" },
{ "countryCode": "PH", "color": "#39835f" },
{ "countryCode": "JP", "color": "#7faadc" },
{ "countryCode": "MA", "color": "#4ef320" },
{ "countryCode": "AM", "color": "#e93f36" },
{ "countryCode": "US", "color": "#836747" },
{ "countryCode": "ID", "color": "#c9e12c" },
{ "countryCode": "CN", "color": "#b94f3b" },
{ "countryCode": "PH", "color": "#6e69ac" },
{ "countryCode": "PT", "color": "#d5ff04" },
{ "countryCode": "RU", "color": "#e61624" },
{ "countryCode": "PT", "color": "#184f47" },
{ "countryCode": "PS", "color": "#fa04ff" },
{ "countryCode": "CN", "color": "#9972cb" },
{ "countryCode": "SE", "color": "#654a0f" },
{ "countryCode": "PH", "color": "#6f1080" },
{ "countryCode": "PH", "color": "#222216" },
{ "countryCode": "ID", "color": "#456696" },
{ "countryCode": "CN", "color": "#dad1b0" },
{ "countryCode": "BR", "color": "#a3ea25" },
{ "countryCode": "CN", "color": "#88962c" },
{ "countryCode": "ID", "color": "#7690d7" },
{ "countryCode": "KZ", "color": "#dc761c" },
{ "countryCode": "CN", "color": "#30e1ee" },
{ "countryCode": "ID", "color": "#829a13" },
{ "countryCode": "EC", "color": "#02e7b8" },
{ "countryCode": "RU", "color": "#60e943" },
{ "countryCode": "ID", "color": "#35b7e4" },
{ "countryCode": "JP", "color": "#362e0b" },
{ "countryCode": "KG", "color": "#46fb4b" },
{ "countryCode": "NG", "color": "#695b93" },
{ "countryCode": "FR", "color": "#69b97f" },
{ "countryCode": "CZ", "color": "#b88a4b" },
{ "countryCode": "FR", "color": "#74af0e" },
{ "countryCode": "ID", "color": "#1a71a8" },
{ "countryCode": "CZ", "color": "#0ae562" },
{ "countryCode": "JP", "color": "#42d575" },
{ "countryCode": "MX", "color": "#0ddd57" },
{ "countryCode": "PH", "color": "#9d487e" },
{ "countryCode": "US", "color": "#aa60e6" },
{ "countryCode": "PH", "color": "#e00c10" },
{ "countryCode": "CZ", "color": "#629f68" },
{ "countryCode": "ID", "color": "#16743a" },
{ "countryCode": "CN", "color": "#f70ca9" },
{ "countryCode": "TH", "color": "#3bc2dc" },
{ "countryCode": "CN", "color": "#88bcc5" },
{ "countryCode": "ID", "color": "#789899" },
{ "countryCode": "TN", "color": "#5b8fae" },
{ "countryCode": "MD", "color": "#67c2c5" },
{ "countryCode": "PL", "color": "#257719" },
{ "countryCode": "CN", "color": "#bedb39" },
{ "countryCode": "SE", "color": "#bae49e" },
{ "countryCode": "JP", "color": "#3f729b" },
{ "countryCode": "NC", "color": "#50e4ea" },
{ "countryCode": "NO", "color": "#842039" },
{ "countryCode": "CN", "color": "#363e53" },
{ "countryCode": "FR", "color": "#5a5163" },
{ "countryCode": "AR", "color": "#0b6e67" },
{ "countryCode": "ID", "color": "#c2f892" },
{ "countryCode": "CN", "color": "#b8b29c" },
{ "countryCode": "ID", "color": "#423075" },
{ "countryCode": "JP", "color": "#d423bb" },
{ "countryCode": "BR", "color": "#838a09" },
{ "countryCode": "PH", "color": "#71226a" },
{ "countryCode": "LY", "color": "#e75c1e" },
{ "countryCode": "CN", "color": "#f8995f" },
{ "countryCode": "PH", "color": "#190e69" },
{ "countryCode": "BR", "color": "#102f32" },
{ "countryCode": "CN", "color": "#ca30d7" },
{ "countryCode": "CZ", "color": "#ef8684" },
{ "countryCode": "FR", "color": "#b7936d" },
{ "countryCode": "ID", "color": "#d990c8" },
{ "countryCode": "RU", "color": "#31513f" },
{ "countryCode": "HT", "color": "#9f4175" },
{ "countryCode": "CN", "color": "#d979f0" },
{ "countryCode": "CI", "color": "#2f3f5a" },
{ "countryCode": "PL", "color": "#c98acf" },
{ "countryCode": "ZA", "color": "#2289ab" },
{ "countryCode": "TD", "color": "#6d610c" },
{ "countryCode": "RU", "color": "#b1287d" },
{ "countryCode": "CZ", "color": "#d363ee" },
{ "countryCode": "BW", "color": "#f58ea8" },
{ "countryCode": "PT", "color": "#0313e2" },
{ "countryCode": "BR", "color": "#3f0beb" },
{ "countryCode": "BR", "color": "#296467" },
{ "countryCode": "FR", "color": "#89d6c4" },
{ "countryCode": "HU", "color": "#cc5816" },
{ "countryCode": "LA", "color": "#d99885" },
{ "countryCode": "PY", "color": "#30e770" },
{ "countryCode": "BR", "color": "#08a2f7" },
{ "countryCode": "IR", "color": "#9b6844" },
{ "countryCode": "ID", "color": "#d5de32" },
{ "countryCode": "EC", "color": "#c08003" },
{ "countryCode": "PE", "color": "#0fdd90" },
{ "countryCode": "CA", "color": "#70c4d4" },
{ "countryCode": "BA", "color": "#92a25a" },
{ "countryCode": "PL", "color": "#8d5270" },
{ "countryCode": "UA", "color": "#3b0f9e" },
{ "countryCode": "HR", "color": "#ae9334" },
{ "countryCode": "BR", "color": "#528491" },
{ "countryCode": "ID", "color": "#52b673" },
{ "countryCode": "AR", "color": "#f7f3ed" },
{ "countryCode": "ID", "color": "#918617" },
{ "countryCode": "CO", "color": "#313bff" },
{ "countryCode": "RU", "color": "#ee212b" },
{ "countryCode": "ID", "color": "#715958" },
{ "countryCode": "CO", "color": "#bfaa3e" },
{ "countryCode": "PH", "color": "#3fc84c" },
{ "countryCode": "FR", "color": "#d6cff5" },
{ "countryCode": "CN", "color": "#b5d28d" },
{ "countryCode": "PL", "color": "#9afb62" },
{ "countryCode": "SI", "color": "#b7cd6b" },
{ "countryCode": "PA", "color": "#11c097" },
{ "countryCode": "CN", "color": "#44dec0" },
{ "countryCode": "VN", "color": "#d6886f" },
{ "countryCode": "ID", "color": "#47abc8" },
{ "countryCode": "ID", "color": "#b0d7d3" },
{ "countryCode": "PT", "color": "#9d0a2b" },
{ "countryCode": "FR", "color": "#639d5a" },
{ "countryCode": "CN", "color": "#ad4cfd" },
{ "countryCode": "PG", "color": "#a8c40b" },
{ "countryCode": "CN", "color": "#59e1a0" },
{ "countryCode": "ID", "color": "#847337" },
{ "countryCode": "MN", "color": "#9a6816" },
{ "countryCode": "LU", "color": "#8e46c4" },
{ "countryCode": "CN", "color": "#162b8f" },
{ "countryCode": "ID", "color": "#e6a63a" },
{ "countryCode": "IE", "color": "#ea2bde" },
{ "countryCode": "GR", "color": "#f58fa6" },
{ "countryCode": "PH", "color": "#eaa04b" },
{ "countryCode": "PH", "color": "#fcb31b" },
{ "countryCode": "RU", "color": "#0e2d6e" },
{ "countryCode": "HN", "color": "#9e0077" },
{ "countryCode": "AE", "color": "#0a3d29" },
{ "countryCode": "TZ", "color": "#2b890f" },
{ "countryCode": "RU", "color": "#f1c4f2" },
{ "countryCode": "RU", "color": "#ac3719" },
{ "countryCode": "OM", "color": "#4d9c73" },
{ "countryCode": "CD", "color": "#bf5bab" },
{ "countryCode": "BA", "color": "#1e4d2a" },
{ "countryCode": "ID", "color": "#d3e9e6" },
{ "countryCode": "CN", "color": "#f94ba7" },
{ "countryCode": "JP", "color": "#ab7e60" },
{ "countryCode": "DE", "color": "#039dca" },
{ "countryCode": "BR", "color": "#7ec61a" },
{ "countryCode": "LU", "color": "#212a25" },
{ "countryCode": "ID", "color": "#c24934" },
{ "countryCode": "VN", "color": "#f96a42" },
{ "countryCode": "PT", "color": "#00e6d7" },
{ "countryCode": "PS", "color": "#9351c0" },
{ "countryCode": "CN", "color": "#f1e201" },
{ "countryCode": "SO", "color": "#b1ce92" },
{ "countryCode": "UY", "color": "#fd9329" },
{ "countryCode": "ID", "color": "#ff77da" },
{ "countryCode": "CZ", "color": "#509ab5" },
{ "countryCode": "ID", "color": "#a618df" },
{ "countryCode": "RU", "color": "#868561" },
{ "countryCode": "CN", "color": "#559e3d" },
{ "countryCode": "QA", "color": "#12522d" },
{ "countryCode": "BR", "color": "#4d2044" },
{ "countryCode": "CN", "color": "#8d42cf" },
{ "countryCode": "UG", "color": "#fd7886" },
{ "countryCode": "TH", "color": "#f80fd0" },
{ "countryCode": "MN", "color": "#1287f4" },
{ "countryCode": "ET", "color": "#fe8586" },
{ "countryCode": "PT", "color": "#4c80bd" },
{ "countryCode": "PH", "color": "#96528f" },
{ "countryCode": "RU", "color": "#2947be" },
{ "countryCode": "FR", "color": "#1efe4f" },
{ "countryCode": "BR", "color": "#6022c6" },
{ "countryCode": "NG", "color": "#eeb88d" },
{ "countryCode": "TM", "color": "#2f7e79" },
{ "countryCode": "ID", "color": "#c2e100" },
{ "countryCode": "PH", "color": "#c6de9a" },
{ "countryCode": "FR", "color": "#a33578" },
{ "countryCode": "MV", "color": "#8591ab" },
{ "countryCode": "CN", "color": "#fbb8e4" },
{ "countryCode": "LA", "color": "#a86b79" },
{ "countryCode": "CN", "color": "#93501b" },
{ "countryCode": "RU", "color": "#72b008" },
{ "countryCode": "SV", "color": "#526816" },
{ "countryCode": "JP", "color": "#311f3f" },
{ "countryCode": "MY", "color": "#a31614" },
{ "countryCode": "LY", "color": "#513a70" },
{ "countryCode": "UA", "color": "#23edb0" },
{ "countryCode": "MV", "color": "#29bbd0" },
{ "countryCode": "CN", "color": "#a10893" },
{ "countryCode": "CN", "color": "#3e48a7" },
{ "countryCode": "CN", "color": "#27a0e5" },
{ "countryCode": "CN", "color": "#1b2497" },
{ "countryCode": "ID", "color": "#3f9644" },
{ "countryCode": "AM", "color": "#f9d8fb" },
{ "countryCode": "MM", "color": "#65cb96" },
{ "countryCode": "AF", "color": "#218b7a" },
{ "countryCode": "RU", "color": "#af75c3" },
{ "countryCode": "ID", "color": "#43b481" },
{ "countryCode": "UA", "color": "#e3519b" },
{ "countryCode": "LV", "color": "#a47d44" },
{ "countryCode": "CN", "color": "#61232b" },
{ "countryCode": "PL", "color": "#41791f" },
{ "countryCode": "ID", "color": "#2f6821" },
{ "countryCode": "PT", "color": "#eb5c56" },
{ "countryCode": "ID", "color": "#7bbc59" },
{ "countryCode": "JP", "color": "#77d4db" },
{ "countryCode": "CN", "color": "#b7e259" },
{ "countryCode": "SE", "color": "#d7ffb0" },
{ "countryCode": "CN", "color": "#854bfd" },
{ "countryCode": "ID", "color": "#0d191d" },
{ "countryCode": "GR", "color": "#9b7b89" },
{ "countryCode": "MY", "color": "#a8b90c" },
{ "countryCode": "BR", "color": "#ade968" },
{ "countryCode": "PL", "color": "#88d499" },
{ "countryCode": "SN", "color": "#aa4499" },
{ "countryCode": "FR", "color": "#239cc2" },
{ "countryCode": "RS", "color": "#b257c4" },
{ "countryCode": "PL", "color": "#1311c9" },
{ "countryCode": "PL", "color": "#83f88d" },
{ "countryCode": "TH", "color": "#34b715" },
{ "countryCode": "AR", "color": "#2bcf15" },
{ "countryCode": "UA", "color": "#a1e014" },
{ "countryCode": "PH", "color": "#a20027" },
{ "countryCode": "BA", "color": "#6a46a7" },
{ "countryCode": "BR", "color": "#a12107" },
{ "countryCode": "CN", "color": "#a08967" },
{ "countryCode": "CN", "color": "#3050bf" },
{ "countryCode": "CN", "color": "#0e5337" },
{ "countryCode": "CA", "color": "#934839" },
{ "countryCode": "SE", "color": "#2e545b" },
{ "countryCode": "RU", "color": "#923748" },
{ "countryCode": "US", "color": "#eac508" },
{ "countryCode": "AL", "color": "#e28d5e" },
{ "countryCode": "JP", "color": "#90179e" },
{ "countryCode": "CN", "color": "#40e5b3" },
{ "countryCode": "ID", "color": "#8f8b17" },
{ "countryCode": "MD", "color": "#820dab" },
{ "countryCode": "IR", "color": "#b455f9" },
{ "countryCode": "ID", "color": "#0e1a7d" },
{ "countryCode": "SE", "color": "#5cc439" },
{ "countryCode": "UZ", "color": "#84be38" },
{ "countryCode": "FR", "color": "#e72989" },
{ "countryCode": "CN", "color": "#3e4485" },
{ "countryCode": "TM", "color": "#bd6b90" },
{ "countryCode": "PS", "color": "#b616ac" },
{ "countryCode": "CN", "color": "#f6c743" },
{ "countryCode": "CN", "color": "#41fe1d" },
{ "countryCode": "CN", "color": "#a12781" },
{ "countryCode": "BR", "color": "#22d463" },
{ "countryCode": "KM", "color": "#c04272" },
{ "countryCode": "CN", "color": "#3bcead" },
{ "countryCode": "LY", "color": "#701636" },
{ "countryCode": "CN", "color": "#b77037" },
{ "countryCode": "IE", "color": "#579d24" },
{ "countryCode": "CN", "color": "#c4a0af" },
{ "countryCode": "PS", "color": "#e7a70e" },
{ "countryCode": "CN", "color": "#befe8d" },
{ "countryCode": "SE", "color": "#e7044e" },
{ "countryCode": "US", "color": "#3ac0fe" },
{ "countryCode": "CN", "color": "#785078" },
{ "countryCode": "CN", "color": "#54164c" },
{ "countryCode": "VN", "color": "#efbc93" },
{ "countryCode": "HR", "color": "#d497d5" },
{ "countryCode": "CH", "color": "#df3a8a" },
{ "countryCode": "US", "color": "#457f82" },
{ "countryCode": "DO", "color": "#502559" },
{ "countryCode": "ID", "color": "#51c7d8" },
{ "countryCode": "IE", "color": "#f6462c" },
{ "countryCode": "BW", "color": "#671468" },
{ "countryCode": "MY", "color": "#de811c" },
{ "countryCode": "US", "color": "#408a13" },
{ "countryCode": "LI", "color": "#1248e1" },
{ "countryCode": "CN", "color": "#d018d6" },
{ "countryCode": "CN", "color": "#bcc1cd" },
{ "countryCode": "PE", "color": "#ecfab3" },
{ "countryCode": "CZ", "color": "#39d67e" },
{ "countryCode": "FR", "color": "#0fda07" },
{ "countryCode": "CN", "color": "#0b767d" },
{ "countryCode": "PE", "color": "#387626" },
{ "countryCode": "CN", "color": "#90ed22" },
{ "countryCode": "SE", "color": "#5bb7c0" },
{ "countryCode": "BR", "color": "#65abcd" },
{ "countryCode": "ID", "color": "#7c4821" },
{ "countryCode": "NE", "color": "#545b45" },
{ "countryCode": "SE", "color": "#3b1c97" },
{ "countryCode": "BR", "color": "#23716c" },
{ "countryCode": "PH", "color": "#b05629" },
{ "countryCode": "CN", "color": "#0cd9c9" },
{ "countryCode": "AO", "color": "#5aef07" },
{ "countryCode": "CN", "color": "#9a0ed5" },
{ "countryCode": "SY", "color": "#37dbad" },
{ "countryCode": "BO", "color": "#84b708" },
{ "countryCode": "IQ", "color": "#5c0c1f" },
{ "countryCode": "BR", "color": "#1f29e9" },
{ "countryCode": "HU", "color": "#5b4f4a" },
{ "countryCode": "RS", "color": "#89ba16" },
{ "countryCode": "CN", "color": "#880137" },
{ "countryCode": "ID", "color": "#6a40c8" },
{ "countryCode": "PT", "color": "#17831e" },
{ "countryCode": "SL", "color": "#cf604c" },
{ "countryCode": "PL", "color": "#5c9452" },
{ "countryCode": "ID", "color": "#14f278" },
{ "countryCode": "CZ", "color": "#807483" },
{ "countryCode": "PT", "color": "#935ef0" },
{ "countryCode": "PT", "color": "#aeed36" },
{ "countryCode": "CN", "color": "#3c33f7" },
{ "countryCode": "ID", "color": "#14940a" },
{ "countryCode": "NO", "color": "#525786" },
{ "countryCode": "PT", "color": "#4ba310" },
{ "countryCode": "BD", "color": "#4d561d" },
{ "countryCode": "RU", "color": "#55aa5c" },
{ "countryCode": "PT", "color": "#d9cf89" },
{ "countryCode": "KR", "color": "#2ee6a3" },
{ "countryCode": "CO", "color": "#44d3a8" },
{ "countryCode": "TH", "color": "#9f235c" },
{ "countryCode": "CA", "color": "#c60706" },
{ "countryCode": "CN", "color": "#df6baf" },
{ "countryCode": "SO", "color": "#2c5109" },
{ "countryCode": "RU", "color": "#29f0b5" },
{ "countryCode": "UA", "color": "#939d2f" },
{ "countryCode": "PH", "color": "#2d4627" },
{ "countryCode": "PE", "color": "#8e8785" },
{ "countryCode": "RU", "color": "#d4d264" },
{ "countryCode": "RU", "color": "#711e85" },
{ "countryCode": "CO", "color": "#e71317" },
{ "countryCode": "CA", "color": "#22bfe7" },
{ "countryCode": "SY", "color": "#61d74f" },
{ "countryCode": "RU", "color": "#7bc5fe" },
{ "countryCode": "SE", "color": "#10b879" },
{ "countryCode": "ID", "color": "#faeedb" },
{ "countryCode": "KE", "color": "#cebe0f" },
{ "countryCode": "ID", "color": "#d51456" },
{ "countryCode": "NZ", "color": "#41fb20" },
{ "countryCode": "AF", "color": "#b7bca7" },
{ "countryCode": "KZ", "color": "#ae27a1" },
{ "countryCode": "CN", "color": "#2e5781" },
{ "countryCode": "AM", "color": "#a64774" },
{ "countryCode": "IR", "color": "#ef334c" },
{ "countryCode": "PT", "color": "#898e4d" },
{ "countryCode": "BR", "color": "#e41491" },
{ "countryCode": "FR", "color": "#162e2c" },
{ "countryCode": "CN", "color": "#c1c0b8" },
{ "countryCode": "NG", "color": "#8ea677" },
{ "countryCode": "FR", "color": "#2fbac7" },
{ "countryCode": "PH", "color": "#c3c4fc" },
{ "countryCode": "US", "color": "#8f5282" },
{ "countryCode": "CN", "color": "#937863" },
{ "countryCode": "AR", "color": "#1792d5" },
{ "countryCode": "JP", "color": "#8f74dd" },
{ "countryCode": "PL", "color": "#c52a14" },
{ "countryCode": "PT", "color": "#6144e4" },
{ "countryCode": "US", "color": "#efe131" },
{ "countryCode": "CN", "color": "#75deaa" },
{ "countryCode": "CZ", "color": "#72241f" },
{ "countryCode": "ID", "color": "#b5cd44" },
{ "countryCode": "KZ", "color": "#dc9aed" },
{ "countryCode": "IR", "color": "#d299dd" },
{ "countryCode": "PH", "color": "#2326ce" },
{ "countryCode": "CF", "color": "#c58dec" },
{ "countryCode": "CY", "color": "#491d19" },
{ "countryCode": "LV", "color": "#a8fd48" },
{ "countryCode": "CN", "color": "#d59998" },
{ "countryCode": "PH", "color": "#a4d718" },
{ "countryCode": "ID", "color": "#fa6468" },
{ "countryCode": "BR", "color": "#cade50" },
{ "countryCode": "NO", "color": "#766502" },
{ "countryCode": "MM", "color": "#6e5bd7" },
{ "countryCode": "MA", "color": "#ff0338" },
{ "countryCode": "CN", "color": "#e47580" },
{ "countryCode": "SZ", "color": "#e36ca1" },
{ "countryCode": "US", "color": "#23a935" },
{ "countryCode": "PT", "color": "#ed52aa" },
{ "countryCode": "PL", "color": "#9a3b90" },
{ "countryCode": "ID", "color": "#b93d68" },
{ "countryCode": "ID", "color": "#2b9329" },
{ "countryCode": "CN", "color": "#4e5b39" },
{ "countryCode": "GR", "color": "#201993" },
{ "countryCode": "PL", "color": "#65ba05" },
{ "countryCode": "RU", "color": "#301fb0" },
{ "countryCode": "LV", "color": "#dc31f5" },
{ "countryCode": "CN", "color": "#4411f8" },
{ "countryCode": "CO", "color": "#3464f7" },
{ "countryCode": "NG", "color": "#06df65" },
{ "countryCode": "GR", "color": "#4a94fc" },
{ "countryCode": "PL", "color": "#cd4b5b" },
{ "countryCode": "CO", "color": "#ce3e07" },
{ "countryCode": "SV", "color": "#9bacc2" },
{ "countryCode": "GR", "color": "#1e793e" },
{ "countryCode": "CA", "color": "#828bbe" },
{ "countryCode": "ID", "color": "#18a5a9" },
{ "countryCode": "CN", "color": "#8fba45" },
{ "countryCode": "AL", "color": "#57d56d" },
{ "countryCode": "PT", "color": "#57c277" },
{ "countryCode": "CA", "color": "#c1a595" },
{ "countryCode": "RU", "color": "#8e54ab" },
{ "countryCode": "CN", "color": "#d2a572" },
{ "countryCode": "PH", "color": "#7d02b9" },
{ "countryCode": "CN", "color": "#230261" },
{ "countryCode": "ID", "color": "#5a27ea" },
{ "countryCode": "SD", "color": "#ac45e6" },
{ "countryCode": "PH", "color": "#969a30" },
{ "countryCode": "CN", "color": "#fde7cd" },
{ "countryCode": "CN", "color": "#f53dd6" },
{ "countryCode": "CN", "color": "#bc6d3f" },
{ "countryCode": "RU", "color": "#ae487c" },
{ "countryCode": "CN", "color": "#796a77" },
{ "countryCode": "GR", "color": "#6d14c2" },
{ "countryCode": "JM", "color": "#534047" },
{ "countryCode": "PH", "color": "#e598ee" },
{ "countryCode": "MN", "color": "#5355b2" },
{ "countryCode": "ID", "color": "#b35b95" },
{ "countryCode": "PF", "color": "#ac4136" },
{ "countryCode": "ID", "color": "#cac145" },
{ "countryCode": "GT", "color": "#c12515" },
{ "countryCode": "ID", "color": "#9f27a7" },
{ "countryCode": "ID", "color": "#e6c47d" },
{ "countryCode": "CN", "color": "#be2432" },
{ "countryCode": "YE", "color": "#cce970" },
{ "countryCode": "EC", "color": "#dbf3f1" },
{ "countryCode": "TH", "color": "#c08250" },
{ "countryCode": "GB", "color": "#369eab" },
{ "countryCode": "CN", "color": "#cea569" },
{ "countryCode": "PK", "color": "#d5f039" },
{ "countryCode": "FR", "color": "#f4e6f3" },
{ "countryCode": "KH", "color": "#6c1874" },
{ "countryCode": "CN", "color": "#5c7af9" },
{ "countryCode": "RU", "color": "#c37879" },
{ "countryCode": "MA", "color": "#e8f6f5" },
{ "countryCode": "CN", "color": "#c13e60" },
{ "countryCode": "LU", "color": "#fa93ee" },
{ "countryCode": "PL", "color": "#e66953" },
{ "countryCode": "CN", "color": "#4234c8" },
{ "countryCode": "PT", "color": "#871a7c" },
{ "countryCode": "HN", "color": "#86dec5" },
{ "countryCode": "ID", "color": "#7e2650" },
{ "countryCode": "ML", "color": "#343ca1" },
{ "countryCode": "JO", "color": "#9468fe" },
{ "countryCode": "ID", "color": "#faae61" },
{ "countryCode": "MX", "color": "#7acc88" },
{ "countryCode": "CZ", "color": "#ff60cc" },
{ "countryCode": "CR", "color": "#57873d" },
{ "countryCode": "ID", "color": "#c6db1c" },
{ "countryCode": "RU", "color": "#96891b" },
{ "countryCode": "BR", "color": "#7d7dd4" },
{ "countryCode": "CN", "color": "#23cb2e" },
{ "countryCode": "CN", "color": "#001a0e" },
{ "countryCode": "AM", "color": "#d02011" },
{ "countryCode": "CN", "color": "#5535b1" },
{ "countryCode": "NG", "color": "#795554" },
{ "countryCode": "NO", "color": "#5b7717" },
{ "countryCode": "BR", "color": "#a076a5" },
{ "countryCode": "RU", "color": "#b2cfc4" },
{ "countryCode": "PL", "color": "#360ba1" },
{ "countryCode": "PH", "color": "#451620" },
{ "countryCode": "CN", "color": "#8c91f5" },
{ "countryCode": "PG", "color": "#a62a97" },
{ "countryCode": "CN", "color": "#11e763" },
{ "countryCode": "AM", "color": "#e74c4a" },
{ "countryCode": "KR", "color": "#37ca3d" },
{ "countryCode": "JP", "color": "#d0fef0" },
{ "countryCode": "CN", "color": "#e96826" },
{ "countryCode": "CO", "color": "#a552b5" },
{ "countryCode": "UY", "color": "#f6cf1c" },
{ "countryCode": "PE", "color": "#896a88" },
{ "countryCode": "GR", "color": "#d281af" },
{ "countryCode": "TH", "color": "#2d0003" },
{ "countryCode": "CN", "color": "#dc15c3" },
{ "countryCode": "RU", "color": "#e01d58" },
{ "countryCode": "NL", "color": "#7502dd" },
{ "countryCode": "TW", "color": "#e5b193" },
{ "countryCode": "AL", "color": "#a9e59d" },
{ "countryCode": "CO", "color": "#9f3743" },
{ "countryCode": "CN", "color": "#824da5" },
{ "countryCode": "ID", "color": "#cb5b0e" },
{ "countryCode": "CN", "color": "#c807e2" },
{ "countryCode": "MA", "color": "#3832d1" },
{ "countryCode": "RU", "color": "#19a2ca" },
{ "countryCode": "RU", "color": "#ae07fa" },
{ "countryCode": "UZ", "color": "#a0ee5e" },
{ "countryCode": "GM", "color": "#fe0875" },
{ "countryCode": "SZ", "color": "#9ae43a" },
{ "countryCode": "ID", "color": "#e6b30f" },
{ "countryCode": "CN", "color": "#c0c5d4" },
{ "countryCode": "ID", "color": "#ab78d1" },
{ "countryCode": "PL", "color": "#00799d" },
{ "countryCode": "PH", "color": "#603808" },
{ "countryCode": "ID", "color": "#3f0108" },
{ "countryCode": "SI", "color": "#a5c22e" },
{ "countryCode": "PH", "color": "#301ac1" },
{ "countryCode": "PL", "color": "#bfd349" },
{ "countryCode": "EC", "color": "#b557b0" },
{ "countryCode": "GR", "color": "#5450e6" },
{ "countryCode": "BA", "color": "#eb4275" },
{ "countryCode": "PH", "color": "#7a27fa" },
{ "countryCode": "RU", "color": "#c47537" },
{ "countryCode": "JP", "color": "#4b3ae3" },
{ "countryCode": "CN", "color": "#17faca" },
{ "countryCode": "PH", "color": "#c0b9a4" },
{ "countryCode": "CN", "color": "#951165" },
{ "countryCode": "CN", "color": "#94e19e" },
{ "countryCode": "PH", "color": "#3fd34f" },
{ "countryCode": "CN", "color": "#1d27de" },
{ "countryCode": "BO", "color": "#7da618" },
{ "countryCode": "CN", "color": "#ec5faf" },
{ "countryCode": "CN", "color": "#8bf51e" },
{ "countryCode": "US", "color": "#90d232" },
{ "countryCode": "JP", "color": "#25fb52" },
{ "countryCode": "GM", "color": "#7a937e" },
{ "countryCode": "JP", "color": "#c79bb7" },
{ "countryCode": "GP", "color": "#232f76" },
{ "countryCode": "CN", "color": "#3e9e96" },
{ "countryCode": "ID", "color": "#ef40f1" },
{ "countryCode": "US", "color": "#53ea9a" },
{ "countryCode": "ET", "color": "#64502d" },
{ "countryCode": "CN", "color": "#609eb5" },
{ "countryCode": "PL", "color": "#2d9db6" },
{ "countryCode": "IL", "color": "#059335" },
{ "countryCode": "ID", "color": "#735317" },
{ "countryCode": "RU", "color": "#f61a24" },
{ "countryCode": "SY", "color": "#f40bb3" },
{ "countryCode": "AF", "color": "#5b21fd" },
{ "countryCode": "PT", "color": "#5233ba" },
{ "countryCode": "CZ", "color": "#1bb5d0" },
{ "countryCode": "FR", "color": "#ff7ade" },
{ "countryCode": "SY", "color": "#9d1f49" },
{ "countryCode": "ID", "color": "#a95adb" },
{ "countryCode": "RW", "color": "#82e427" },
{ "countryCode": "NP", "color": "#470acf" },
{ "countryCode": "CN", "color": "#6e90e4" },
{ "countryCode": "LA", "color": "#f03bae" },
{ "countryCode": "CN", "color": "#a9c6b5" },
{ "countryCode": "YE", "color": "#37ac52" },
{ "countryCode": "EC", "color": "#14ffa5" },
{ "countryCode": "CN", "color": "#32719c" },
{ "countryCode": "PH", "color": "#7de147" },
{ "countryCode": "NG", "color": "#f75fab" },
{ "countryCode": "ID", "color": "#51ad74" },
{ "countryCode": "PG", "color": "#d1d57d" },
{ "countryCode": "ID", "color": "#5c1e5f" },
{ "countryCode": "CN", "color": "#2163ae" },
{ "countryCode": "CN", "color": "#5b6199" },
{ "countryCode": "PH", "color": "#7497c8" },
{ "countryCode": "CN", "color": "#f0747c" },
{ "countryCode": "CI", "color": "#defb69" },
{ "countryCode": "ID", "color": "#056f68" },
{ "countryCode": "HU", "color": "#be9448" },
{ "countryCode": "US", "color": "#89b454" },
{ "countryCode": "SE", "color": "#b6c1f0" },
{ "countryCode": "CN", "color": "#22fbd0" },
{ "countryCode": "TZ", "color": "#58fd19" },
{ "countryCode": "ID", "color": "#0a5e52" },
{ "countryCode": "PH", "color": "#ee7391" },
{ "countryCode": "RU", "color": "#0d3243" },
{ "countryCode": "SA", "color": "#1dfdfb" },
{ "countryCode": "ID", "color": "#c91131" },
{ "countryCode": "UA", "color": "#42c213" },
{ "countryCode": "AR", "color": "#ed7738" },
{ "countryCode": "CO", "color": "#2a7bcc" },
{ "countryCode": "CO", "color": "#9f2e84" },
{ "countryCode": "PT", "color": "#f6e1d4" },
{ "countryCode": "ID", "color": "#3fd0c8" },
{ "countryCode": "GR", "color": "#78c13c" },
{ "countryCode": "ID", "color": "#65e67d" },
{ "countryCode": "MK", "color": "#ffca2d" },
{ "countryCode": "CN", "color": "#67dc2a" },
{ "countryCode": "BR", "color": "#80d755" },
{ "countryCode": "IL", "color": "#9f15f3" },
{ "countryCode": "GR", "color": "#1b0e56" },
{ "countryCode": "FR", "color": "#e94145" },
{ "countryCode": "RU", "color": "#96b9ba" },
{ "countryCode": "BR", "color": "#d4de63" },
{ "countryCode": "ID", "color": "#a1f056" },
{ "countryCode": "AR", "color": "#c49572" },
{ "countryCode": "ID", "color": "#9c5cff" },
{ "countryCode": "FR", "color": "#f95ef5" },
{ "countryCode": "JP", "color": "#8f5503" },
{ "countryCode": "DJ", "color": "#ee0f96" },
{ "countryCode": "RU", "color": "#ce6f49" },
{ "countryCode": "PH", "color": "#bb334d" },
{ "countryCode": "CM", "color": "#6b668c" },
{ "countryCode": "RU", "color": "#122676" },
{ "countryCode": "ID", "color": "#f2082e" },
{ "countryCode": "CN", "color": "#81df62" },
{ "countryCode": "VN", "color": "#b5d09a" },
{ "countryCode": "TH", "color": "#ca9231" },
{ "countryCode": "PT", "color": "#0ffc29" },
{ "countryCode": "CN", "color": "#26b57d" },
{ "countryCode": "PH", "color": "#2df3a9" },
{ "countryCode": "NG", "color": "#964c8f" },
{ "countryCode": "ID", "color": "#6b1814" },
{ "countryCode": "CN", "color": "#1d37b1" },
{ "countryCode": "PH", "color": "#062b90" },
{ "countryCode": "CN", "color": "#7ae2b2" },
{ "countryCode": "PK", "color": "#dc9943" },
{ "countryCode": "CN", "color": "#dcb0da" },
{ "countryCode": "ID", "color": "#390d65" },
{ "countryCode": "RU", "color": "#451d62" },
{ "countryCode": "ZA", "color": "#d9026c" },
{ "countryCode": "BA", "color": "#3cc35c" },
{ "countryCode": "SI", "color": "#a376e9" },
{ "countryCode": "TL", "color": "#5b5b13" },
{ "countryCode": "RU", "color": "#ef7116" },
{ "countryCode": "RU", "color": "#0bf989" },
{ "countryCode": "AZ", "color": "#c083e8" },
{ "countryCode": "PT", "color": "#4bf0ce" },
{ "countryCode": "SE", "color": "#5eb31e" },
{ "countryCode": "PL", "color": "#1ccfa0" },
{ "countryCode": "AM", "color": "#b64994" },
{ "countryCode": "CN", "color": "#c0eba0" },
{ "countryCode": "ID", "color": "#45f26e" },
{ "countryCode": "ID", "color": "#6c4ffc" },
{ "countryCode": "AF", "color": "#e8a86f" },
{ "countryCode": "HN", "color": "#dd55f2" },
{ "countryCode": "CN", "color": "#3696e3" },
{ "countryCode": "PH", "color": "#bf2073" },
{ "countryCode": "UA", "color": "#8581fd" },
{ "countryCode": "AM", "color": "#bec349" },
{ "countryCode": "PT", "color": "#23b919" },
{ "countryCode": "ID", "color": "#e98147" },
{ "countryCode": "CA", "color": "#ee10f5" },
{ "countryCode": "HU", "color": "#ce615b" },
{ "countryCode": "CA", "color": "#536dd5" },
{ "countryCode": "EE", "color": "#bcc0fe" },
{ "countryCode": "CO", "color": "#0a544c" },
{ "countryCode": "PH", "color": "#e13645" },
{ "countryCode": "RU", "color": "#1bf441" },
{ "countryCode": "RU", "color": "#94e389" },
{ "countryCode": "NZ", "color": "#cd99d9" },
{ "countryCode": "BA", "color": "#4116bb" },
{ "countryCode": "BR", "color": "#3cdaac" },
{ "countryCode": "RU", "color": "#4b7e0a" },
{ "countryCode": "CN", "color": "#146e2d" },
{ "countryCode": "AU", "color": "#9eb6c3" },
{ "countryCode": "PH", "color": "#6873d8" },
{ "countryCode": "SE", "color": "#f1aee4" },
{ "countryCode": "ID", "color": "#7a7346" },
{ "countryCode": "VU", "color": "#3a58f6" },
{ "countryCode": "BR", "color": "#094393" },
{ "countryCode": "RU", "color": "#adb160" },
{ "countryCode": "PL", "color": "#99a60c" },
{ "countryCode": "FI", "color": "#007b04" },
{ "countryCode": "PE", "color": "#a98577" },
{ "countryCode": "CM", "color": "#d828db" },
{ "countryCode": "ID", "color": "#571e16" },
{ "countryCode": "DO", "color": "#6b8a3d" },
{ "countryCode": "PL", "color": "#044a9e" },
{ "countryCode": "CN", "color": "#8b8625" },
{ "countryCode": "CN", "color": "#2013fb" },
{ "countryCode": "PH", "color": "#37ae49" },
{ "countryCode": "PT", "color": "#af84ee" },
{ "countryCode": "CN", "color": "#785d70" },
{ "countryCode": "GR", "color": "#f0f777" },
{ "countryCode": "CN", "color": "#7ede3c" },
{ "countryCode": "CN", "color": "#d28667" },
{ "countryCode": "CN", "color": "#1ea5ed" },
{ "countryCode": "CN", "color": "#5885b9" },
{ "countryCode": "RU", "color": "#dc1170" },
{ "countryCode": "BA", "color": "#1bfa8c" },
{ "countryCode": "PT", "color": "#8c119e" },
{ "countryCode": "HN", "color": "#832dbd" },
{ "countryCode": "ID", "color": "#9d6182" },
{ "countryCode": "MX", "color": "#20b730" },
{ "countryCode": "CA", "color": "#7cbc88" },
{ "countryCode": "PT", "color": "#46bab9" },
{ "countryCode": "RU", "color": "#64f60c" },
{ "countryCode": "ID", "color": "#6ea17f" },
{ "countryCode": "PL", "color": "#7a6ec9" },
{ "countryCode": "FR", "color": "#80bb61" },
{ "countryCode": "CN", "color": "#5e1508" },
{ "countryCode": "CN", "color": "#693b10" },
{ "countryCode": "CI", "color": "#39881f" },
{ "countryCode": "CN", "color": "#7d5b8a" },
{ "countryCode": "GR", "color": "#84ef41" },
{ "countryCode": "AR", "color": "#2a80ab" },
{ "countryCode": "MX", "color": "#315dcf" },
{ "countryCode": "FR", "color": "#6e0569" },
{ "countryCode": "BR", "color": "#abbf8f" },
{ "countryCode": "PH", "color": "#99d285" },
{ "countryCode": "ID", "color": "#1af882" },
{ "countryCode": "PH", "color": "#30caad" },
{ "countryCode": "CN", "color": "#b0974b" },
{ "countryCode": "SA", "color": "#974546" },
{ "countryCode": "UA", "color": "#82d993" },
{ "countryCode": "PL", "color": "#1b9794" },
{ "countryCode": "TR", "color": "#220265" },
{ "countryCode": "VN", "color": "#ec1ed0" },
{ "countryCode": "CN", "color": "#bfe1bf" },
{ "countryCode": "PL", "color": "#72bdf6" },
{ "countryCode": "HN", "color": "#1a7c0e" },
{ "countryCode": "TN", "color": "#ebbc8e" },
{ "countryCode": "AR", "color": "#61b2a6" },
{ "countryCode": "ET", "color": "#2de9b0" },
{ "countryCode": "CN", "color": "#a9a8ca" },
{ "countryCode": "SE", "color": "#058729" },
{ "countryCode": "CI", "color": "#af8b26" },
{ "countryCode": "CN", "color": "#cb96ff" },
{ "countryCode": "ID", "color": "#7fbb9b" },
{ "countryCode": "ID", "color": "#629008" },
{ "countryCode": "EG", "color": "#cb3145" },
{ "countryCode": "PH", "color": "#bcb2db" },
{ "countryCode": "ID", "color": "#e567a7" },
{ "countryCode": "CN", "color": "#612b76" },
{ "countryCode": "CN", "color": "#aac97d" },
{ "countryCode": "CN", "color": "#593ce5" },
{ "countryCode": "PE", "color": "#a6cc68" },
{ "countryCode": "SI", "color": "#3e0db4" },
{ "countryCode": "MZ", "color": "#aaae42" },
{ "countryCode": "MY", "color": "#9a4c8e" },
{ "countryCode": "CN", "color": "#e9d428" },
{ "countryCode": "SI", "color": "#09e504" },
{ "countryCode": "ID", "color": "#677889" },
{ "countryCode": "RU", "color": "#716252" },
{ "countryCode": "PH", "color": "#e3c1d7" },
{ "countryCode": "AR", "color": "#627899" },
{ "countryCode": "AF", "color": "#ef8f62" },
{ "countryCode": "CN", "color": "#fcec24" },
{ "countryCode": "MX", "color": "#4660bf" },
{ "countryCode": "GB", "color": "#5c776d" },
{ "countryCode": "CY", "color": "#a12daa" },
{ "countryCode": "PK", "color": "#af9ef3" },
{ "countryCode": "AL", "color": "#89da1e" },
{ "countryCode": "EC", "color": "#9f0afe" },
{ "countryCode": "PA", "color": "#a6b6e7" },
{ "countryCode": "ID", "color": "#4f61fb" },
{ "countryCode": "RU", "color": "#057e03" },
{ "countryCode": "AM", "color": "#9eee5b" },
{ "countryCode": "PH", "color": "#5067ef" },
{ "countryCode": "CN", "color": "#c44b60" },
{ "countryCode": "PH", "color": "#93cbbf" },
{ "countryCode": "CN", "color": "#063537" },
{ "countryCode": "BR", "color": "#58afa9" },
{ "countryCode": "CN", "color": "#e1ab81" },
{ "countryCode": "CF", "color": "#c080d6" },
{ "countryCode": "CY", "color": "#52ec13" },
{ "countryCode": "FR", "color": "#0e4c0c" },
{ "countryCode": "CO", "color": "#c2f4f1" },
{ "countryCode": "UA", "color": "#fa34c6" },
{ "countryCode": "AO", "color": "#84ceed" },
{ "countryCode": "RU", "color": "#61b53c" },
{ "countryCode": "US", "color": "#13f8a1" },
{ "countryCode": "FI", "color": "#afa53c" },
{ "countryCode": "CN", "color": "#a0285a" },
{ "countryCode": "UA", "color": "#adfd11" },
{ "countryCode": "ID", "color": "#a2081a" },
{ "countryCode": "ID", "color": "#1e24fb" },
{ "countryCode": "CU", "color": "#f7adf4" },
{ "countryCode": "CN", "color": "#47c5fb" },
{ "countryCode": "ID", "color": "#da5de2" },
{ "countryCode": "ID", "color": "#0a1171" },
{ "countryCode": "BR", "color": "#edf0af" },
{ "countryCode": "PT", "color": "#622b0b" },
{ "countryCode": "ID", "color": "#bad39e" },
{ "countryCode": "PH", "color": "#a06690" },
{ "countryCode": "IR", "color": "#85c25d" },
{ "countryCode": "IE", "color": "#8e36b9" },
{ "countryCode": "CN", "color": "#4ad0f3" },
{ "countryCode": "ID", "color": "#0b51cb" },
{ "countryCode": "BR", "color": "#abe79d" },
{ "countryCode": "CN", "color": "#a24927" },
{ "countryCode": "AR", "color": "#8ca575" },
{ "countryCode": "CO", "color": "#975c33" },
{ "countryCode": "PK", "color": "#af2463" },
{ "countryCode": "RU", "color": "#edd6ca" },
{ "countryCode": "PT", "color": "#d7e8ac" },
{ "countryCode": "CN", "color": "#4ae021" },
{ "countryCode": "US", "color": "#431469" },
{ "countryCode": "GE", "color": "#e8e97f" },
{ "countryCode": "JO", "color": "#f4c06a" },
{ "countryCode": "GR", "color": "#54ad12" },
{ "countryCode": "PH", "color": "#430c86" },
{ "countryCode": "GR", "color": "#7bf5d4" },
{ "countryCode": "RU", "color": "#aa7c82" },
{ "countryCode": "BR", "color": "#76bb5c" },
{ "countryCode": "MA", "color": "#24ce23" },
{ "countryCode": "ID", "color": "#5c28ac" },
{ "countryCode": "PH", "color": "#76ab6d" },
{ "countryCode": "RU", "color": "#e9584e" },
{ "countryCode": "FR", "color": "#a1d0c9" },
{ "countryCode": "AR", "color": "#4ae10c" },
{ "countryCode": "ID", "color": "#f1e429" },
{ "countryCode": "ID", "color": "#cc8b75" },
{ "countryCode": "CN", "color": "#90ddf8" },
{ "countryCode": "SI", "color": "#55c981" },
{ "countryCode": "PH", "color": "#e25fb5" },
{ "countryCode": "TH", "color": "#d6ec90" },
{ "countryCode": "US", "color": "#42c1ea" },
{ "countryCode": "LC", "color": "#18dfc3" },
{ "countryCode": "MY", "color": "#e30444" },
{ "countryCode": "CZ", "color": "#9e5ba8" },
{ "countryCode": "PL", "color": "#bab3d5" },
{ "countryCode": "CN", "color": "#70cf1f" },
{ "countryCode": "CN", "color": "#6f192c" },
{ "countryCode": "ID", "color": "#21606b" },
{ "countryCode": "CN", "color": "#e1e646" },
{ "countryCode": "TN", "color": "#fb8b48" },
{ "countryCode": "GN", "color": "#f77d99" },
{ "countryCode": "PL", "color": "#b1aa39" },
{ "countryCode": "CN", "color": "#3157c3" },
{ "countryCode": "PT", "color": "#1587f1" },
{ "countryCode": "PH", "color": "#4ed0f1" },
{ "countryCode": "US", "color": "#4cdabc" },
{ "countryCode": "ID", "color": "#3eb72c" },
{ "countryCode": "CI", "color": "#84b9de" },
{ "countryCode": "PH", "color": "#a2803b" },
{ "countryCode": "ID", "color": "#89482e" },
{ "countryCode": "FR", "color": "#1a914e" },
{ "countryCode": "CI", "color": "#bf6811" },
{ "countryCode": "BY", "color": "#3721d9" },
{ "countryCode": "PH", "color": "#93d5ed" },
{ "countryCode": "RU", "color": "#4c6a80" },
{ "countryCode": "RU", "color": "#c96ca9" },
{ "countryCode": "CN", "color": "#280606" },
{ "countryCode": "CZ", "color": "#78eec7" },
{ "countryCode": "PA", "color": "#665085" },
{ "countryCode": "PE", "color": "#73b1e6" },
{ "countryCode": "BR", "color": "#5212b0" },
{ "countryCode": "KR", "color": "#e93d17" },
{ "countryCode": "MG", "color": "#be5e17" },
{ "countryCode": "SE", "color": "#f00597" },
{ "countryCode": "GR", "color": "#2556db" },
{ "countryCode": "PK", "color": "#5997dc" },
{ "countryCode": "CO", "color": "#756114" },
{ "countryCode": "CZ", "color": "#2ae0db" },
{ "countryCode": "CN", "color": "#fbe0d6" },
{ "countryCode": "AF", "color": "#217304" },
{ "countryCode": "CN", "color": "#39fd48" },
{ "countryCode": "KR", "color": "#8d8273" },
{ "countryCode": "SE", "color": "#63a19c" },
{ "countryCode": "PH", "color": "#c719ad" },
{ "countryCode": "CN", "color": "#06bf2d" },
{ "countryCode": "RU", "color": "#0ce149" },
{ "countryCode": "FR", "color": "#d2246b" },
{ "countryCode": "ET", "color": "#6cbe99" },
{ "countryCode": "PT", "color": "#312a24" },
{ "countryCode": "AF", "color": "#b86466" },
{ "countryCode": "RU", "color": "#3567d6" },
{ "countryCode": "ID", "color": "#6acd29" },
{ "countryCode": "RU", "color": "#88ec18" },
{ "countryCode": "CN", "color": "#84f058" },
{ "countryCode": "RS", "color": "#17f5bf" },
{ "countryCode": "RS", "color": "#b8d877" },
{ "countryCode": "CN", "color": "#ee48e6" },
{ "countryCode": "CZ", "color": "#081461" },
{ "countryCode": "CZ", "color": "#34124c" },
{ "countryCode": "CN", "color": "#42cdd3" },
{ "countryCode": "CN", "color": "#5c66cf" },
{ "countryCode": "CN", "color": "#f16a33" },
{ "countryCode": "CR", "color": "#a5affe" },
{ "countryCode": "FR", "color": "#080608" },
{ "countryCode": "PL", "color": "#60d6d5" },
{ "countryCode": "JP", "color": "#60c6aa" },
{ "countryCode": "FR", "color": "#88de2b" },
{ "countryCode": "ID", "color": "#df0a89" },
{ "countryCode": "CN", "color": "#c89673" },
{ "countryCode": "CN", "color": "#e38c78" },
{ "countryCode": "CN", "color": "#3ec9a2" },
{ "countryCode": "RU", "color": "#402d0a" },
{ "countryCode": "GR", "color": "#5d274b" },
{ "countryCode": "SY", "color": "#d06eb3" },
{ "countryCode": "ID", "color": "#9427a3" },
{ "countryCode": "PL", "color": "#17b765" },
{ "countryCode": "DE", "color": "#a6ab32" },
{ "countryCode": "VE", "color": "#ee6da8" },
{ "countryCode": "NL", "color": "#6fb46d" },
{ "countryCode": "CZ", "color": "#e1c6d3" },
{ "countryCode": "RU", "color": "#996c2c" },
{ "countryCode": "PL", "color": "#0a6b80" },
{ "countryCode": "RU", "color": "#e534d3" },
{ "countryCode": "CN", "color": "#49c91b" },
{ "countryCode": "VN", "color": "#8d5148" },
{ "countryCode": "CN", "color": "#4dd06c" },
{ "countryCode": "HN", "color": "#a54d3e" },
{ "countryCode": "VE", "color": "#6d4a08" },
{ "countryCode": "CN", "color": "#538322" },
{ "countryCode": "HR", "color": "#750592" },
{ "countryCode": "CU", "color": "#baf176" },
{ "countryCode": "BR", "color": "#d1078f" },
{ "countryCode": "RU", "color": "#0d3892" },
{ "countryCode": "BR", "color": "#7788eb" },
{ "countryCode": "CV", "color": "#aea9e6" },
{ "countryCode": "RU", "color": "#638d03" },
{ "countryCode": "ID", "color": "#c6f251" },
{ "countryCode": "CN", "color": "#854449" },
{ "countryCode": "RU", "color": "#4bbe9a" },
{ "countryCode": "CO", "color": "#e40f4a" },
{ "countryCode": "SE", "color": "#f38deb" },
{ "countryCode": "BY", "color": "#f0e811" },
{ "countryCode": "FR", "color": "#d5c5b5" },
{ "countryCode": "CN", "color": "#12fe0c" },
{ "countryCode": "CZ", "color": "#c42efb" },
{ "countryCode": "PT", "color": "#8d5daa" },
{ "countryCode": "IR", "color": "#dfa916" },
{ "countryCode": "NZ", "color": "#f0f2f9" },
{ "countryCode": "GR", "color": "#83df7f" },
{ "countryCode": "GT", "color": "#ba3822" },
{ "countryCode": "ID", "color": "#f749fb" },
{ "countryCode": "CN", "color": "#163a87" },
{ "countryCode": "ZA", "color": "#6474aa" },
{ "countryCode": "CZ", "color": "#965ca6" },
{ "countryCode": "PH", "color": "#ff645e" },
{ "countryCode": "ID", "color": "#48211d" },
{ "countryCode": "CN", "color": "#8af660" },
{ "countryCode": "SL", "color": "#4cc387" },
{ "countryCode": "CN", "color": "#aa5487" },
{ "countryCode": "PH", "color": "#4569ca" },
{ "countryCode": "AL", "color": "#46a0ca" },
{ "countryCode": "AR", "color": "#188aa7" },
{ "countryCode": "RU", "color": "#bd3845" },
{ "countryCode": "TG", "color": "#61981e" },
{ "countryCode": "PL", "color": "#166ed4" },
{ "countryCode": "AO", "color": "#b9289b" },
{ "countryCode": "PE", "color": "#61a793" },
{ "countryCode": "FR", "color": "#972d05" },
{ "countryCode": "AL", "color": "#769e9c" },
{ "countryCode": "BR", "color": "#4560c5" },
{ "countryCode": "KE", "color": "#6c7541" },
{ "countryCode": "CN", "color": "#004d5b" },
{ "countryCode": "SV", "color": "#3419f9" },
{ "countryCode": "ID", "color": "#e23ba3" },
{ "countryCode": "CN", "color": "#1a2ec2" },
{ "countryCode": "PT", "color": "#608642" },
{ "countryCode": "AF", "color": "#f4d5d9" },
{ "countryCode": "ZA", "color": "#3e6120" },
{ "countryCode": "CO", "color": "#923095" },
{ "countryCode": "RU", "color": "#9fb8e7" },
{ "countryCode": "PH", "color": "#68c4dd" },
{ "countryCode": "ID", "color": "#490eb4" },
{ "countryCode": "RU", "color": "#7e1b60" },
{ "countryCode": "ID", "color": "#4eced9" },
{ "countryCode": "ID", "color": "#ecadca" },
{ "countryCode": "CN", "color": "#274f42" },
{ "countryCode": "GQ", "color": "#e0535d" },
{ "countryCode": "CU", "color": "#b316fe" },
{ "countryCode": "PS", "color": "#a2aca8" },
{ "countryCode": "SE", "color": "#1a0329" },
{ "countryCode": "ET", "color": "#2934ea" },
{ "countryCode": "FR", "color": "#161100" },
{ "countryCode": "IE", "color": "#f674fd" },
{ "countryCode": "CN", "color": "#aeb4f8" },
{ "countryCode": "GR", "color": "#609ad0" },
{ "countryCode": "KP", "color": "#e0f227" },
{ "countryCode": "RU", "color": "#61351d" },
{ "countryCode": "SE", "color": "#16f865" },
{ "countryCode": "PL", "color": "#b23f8a" },
{ "countryCode": "PE", "color": "#2098f7" },
{ "countryCode": "PS", "color": "#859e6a" },
{ "countryCode": "PH", "color": "#5f763a" },
{ "countryCode": "MX", "color": "#67f831" },
{ "countryCode": "PE", "color": "#21b09d" },
{ "countryCode": "NO", "color": "#b07b77" },
{ "countryCode": "VE", "color": "#c431a6" },
{ "countryCode": "TH", "color": "#68a3ae" },
{ "countryCode": "CN", "color": "#bdf641" },
{ "countryCode": "UA", "color": "#fb9be2" },
{ "countryCode": "BO", "color": "#822276" },
{ "countryCode": "PH", "color": "#ba16ba" },
{ "countryCode": "PH", "color": "#e2c79b" },
{ "countryCode": "PL", "color": "#eeb2fc" },
{ "countryCode": "RU", "color": "#fa4a32" },
{ "countryCode": "ID", "color": "#5986cb" },
{ "countryCode": "US", "color": "#434fff" },
{ "countryCode": "ID", "color": "#3d0ec3" },
{ "countryCode": "CA", "color": "#233505" },
{ "countryCode": "GT", "color": "#c3f32f" },
{ "countryCode": "AO", "color": "#a64e40" },
{ "countryCode": "ID", "color": "#21d4d9" },
{ "countryCode": "ID", "color": "#45bce6" },
{ "countryCode": "PH", "color": "#90f758" },
{ "countryCode": "FR", "color": "#8f3848" },
{ "countryCode": "CN", "color": "#8320c1" },
{ "countryCode": "PH", "color": "#9ff0b1" },
{ "countryCode": "CN", "color": "#872d1a" },
{ "countryCode": "CN", "color": "#1cfdb9" },
{ "countryCode": "TH", "color": "#62d620" },
{ "countryCode": "AO", "color": "#259a22" },
{ "countryCode": "CN", "color": "#d5cf82" },
{ "countryCode": "PT", "color": "#3c7283" },
{ "countryCode": "ET", "color": "#2f856f" },
{ "countryCode": "ID", "color": "#b94b7a" },
{ "countryCode": "AZ", "color": "#41cfc5" },
{ "countryCode": "TT", "color": "#8fb63b" },
{ "countryCode": "PH", "color": "#a3326d" },
{ "countryCode": "MU", "color": "#890996" },
{ "countryCode": "PL", "color": "#4983fb" },
{ "countryCode": "PH", "color": "#945b26" }]

    var colorLookup = {};
    countryColor.forEach(function (item) {
        colorLookup[item.countryCode] = item.color;
    })

    function init() {

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;



        scene = new THREE.Scene();


        var color = [0xff0000, 0x00ff00, 0x0000ff, 0x111111];


        for (var i = 1; i < 2; i++) {
            geometry = new THREE.BoxGeometry(i * 100, i * 100, i * 100);
            material = new THREE.MeshBasicMaterial({
                color: color[i - 1],
                wireframe: true
            });

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            mesh.position.setX((i - 1) * 200);
            allItems.push(mesh);
        }

        group = new THREE.Object3D();
        scene.add(group);
        //mesh.rotateOnAxis(axis, 1);
        allItems.push(group);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        window.addEventListener('resize', onWindowResize, false);


    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

        requestAnimationFrame(animate);

        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true


        //allItems.forEach(function (item) {
        //    item.rotation.x += 0.01;
        //    item.rotation.y += 0.02;
        //})

        renderer.render(scene, camera);

    }



    app.controller('workspaceController', function ($http) {

        init();
        animate();

        function makeTextSprite( message, parameters )
        {
            if ( parameters === undefined ) parameters = {};
	
            var fontface = parameters.hasOwnProperty("fontface") ? 
                parameters["fontface"] : "Arial";
	
            var fontsize = parameters.hasOwnProperty("fontsize") ? 
                parameters["fontsize"] : 18;
	
            var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
                parameters["borderThickness"] : 4;
	
            var borderColor = parameters.hasOwnProperty("borderColor") ?
                parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
            var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
                parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

            //var spriteAlignment = parameters.hasOwnProperty("alignment") ?
            //	parameters["alignment"] : THREE.SpriteAlignment.topLeft;

            var spriteAlignment = new THREE.Vector2(1, -1); //THREE.SpriteAlignment.topLeft;
		

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font = "Bold " + fontsize + "px " + fontface;
    
            // get size data (height depends only on font size)
            var metrics = context.measureText( message );
            var textWidth = metrics.width;
	
            // background color
            context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                          + backgroundColor.b + "," + backgroundColor.a + ")";
            // border color
            context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                          + borderColor.b + "," + borderColor.a + ")";

            context.lineWidth = borderThickness;
            roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
            // 1.4 is extra height factor for text below baseline: g,j,p,q.
	
            // text color
            context.fillStyle = "rgba(0, 0, 0, 1.0)";

            context.fillText( message, borderThickness, fontsize + borderThickness);
	
            // canvas contents will be used for a texture
            var texture = new THREE.Texture(canvas) 
            texture.needsUpdate = true;

            var spriteMaterial = new THREE.SpriteMaterial( 
                { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.scale.set(100,50,1.0);
            return sprite;	
        }

        // function for drawing rounded rectangles
        function roundRect(ctx, x, y, w, h, r) 
        {
            ctx.beginPath();
            ctx.moveTo(x+r, y);
            ctx.lineTo(x+w-r, y);
            ctx.quadraticCurveTo(x+w, y, x+w, y+r);
            ctx.lineTo(x+w, y+h-r);
            ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            ctx.lineTo(x+r, y+h);
            ctx.quadraticCurveTo(x, y+h, x, y+h-r);
            ctx.lineTo(x, y+r);
            ctx.quadraticCurveTo(x, y, x+r, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();   
        }


        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'Locations';


        var loc = fo.establishType('spike::location', {
            id: 1,
            countryCode: 'usa',
            city: 'DC',
            lat: 0,
            lng: 0,
            position: function () { return [this.lng, this.lat]; },
            sphere: function () {
                var lat = parseFloat(this.lat);
                var lon = parseFloat(this.lng);

                var cosLat = Math.cos(lat * Math.PI / 180.0);
                var sinLat = Math.sin(lat * Math.PI / 180.0);
                var cosLon = Math.cos(lon * Math.PI / 180.0);
                var sinLon = Math.sin(lon * Math.PI / 180.0);

                var rad = 500.0;
                return [rad * cosLat * cosLon, rad * cosLat * sinLon, rad * sinLat];
            }
        }, fo.makeNode);

        var db = fo.db.getEntityDB(loc.myType);


        // Simple GET request example:
        $http({
            method: 'GET',
            url: '/mock/simplelocations.json'
        }).then(function successCallback(response) {
            var list = [];

            response.data.forEach(function (item) {
                var result = loc.newInstance(item);
                db.setItem(result.id, result);


                geometry = new THREE.BoxGeometry(10, 10, 10);
                material = new THREE.MeshBasicMaterial({
                    color: colorLookup[result.countryCode] || 0x00ffff,
                    wireframe: false
                });

                mesh = new THREE.Mesh(geometry, material);
                //scene.add(mesh);
                var sphere = result.sphere;
                mesh.position.setX(sphere[0]);
                mesh.position.setY(sphere[1]);
                mesh.position.setZ(sphere[2]);
                group.add(mesh)
                //allItems.push(mesh);

                var spritey = makeTextSprite(result.city + ", " + result.countryCode,
                    {
                        fontsize: 24,
                        borderColor: { r: 255, g: 0, b: 0, a: 1.0 },
                        backgroundColor: { r: 255, g: 100, b: 0, a: 0.7 },
                    });
                //spritey.position.setX(sphere[0]);
                //spritey.position.setY(sphere[1]);
                //spritey.position.setZ(sphere[2]);
                mesh.add(spritey);

                list.push(result);
            });


        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            var found = response;
        });

        return this;
    });

 
}(foApp, Foundry));
<?php

for ($i=0; $i < 36; $i++) {
    echo '.demo>img.demo-image[src="https://unsplash.it/' . rand(300, 900) . '/' . rand(300,900) .'?image=' . $i . '"] <br>';
}

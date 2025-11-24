#!/bin/bash

pushd assets/img/gallery/

rm tn-*
for i in *; do convert -resize 200x200 "$i" "tn-$i"; done

popd

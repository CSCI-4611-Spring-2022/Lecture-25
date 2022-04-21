#version 300 es

precision mediump float;

uniform vec3 color;
uniform int useTexture;
uniform sampler2D textureImage;

in vec2 uv;

out vec4 fragColor;

void main() 
{
    fragColor = vec4(color, 1);

    if(useTexture != 0)
    {
        fragColor *= texture(textureImage, uv);
    }
}